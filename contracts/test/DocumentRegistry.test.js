const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

// Enums (mesma ordem do contrato)
const DocType = { Matricula: 0, Escritura: 1, ContratoCompraVenda: 2, Certidao: 3, ComprovantePosse: 4, Outro: 5 };
const Status = { None: 0, Pending: 1, Validated: 2, Rejected: 3, Revoked: 4 };

// docHash = SHA-256 do arquivo (como o navegador calcula). Aqui usamos bytes fictícios.
const sha256Of = (text) => ethers.sha256(ethers.toUtf8Bytes(text));
// propertyRef = keccak256(matrícula + cartório + salt) (ADR 0005), tudo fictício.
const propertyRefOf = (matricula, cartorio, salt) =>
  ethers.solidityPackedKeccak256(["string", "string", "string"], [matricula, cartorio, salt]);

async function deployFixture() {
  const [admin, validator, owner, buyer, holderA, holderB, stranger] = await ethers.getSigners();
  const registry = await ethers.deployContract("DocumentRegistry", [admin.address]);
  const VALIDATOR_ROLE = await registry.VALIDATOR_ROLE();
  await registry.connect(admin).grantRole(VALIDATOR_ROLE, validator.address);

  const prop = propertyRefOf("MAT-0001", "Cartório Demo", "salt-secreto");
  const otherProp = propertyRefOf("MAT-0002", "Cartório Demo", "outro-salt");
  const docA = sha256Of("escritura-seu-jose.pdf");
  const docB = sha256Of("matricula-seu-jose.pdf");
  return { registry, admin, validator, owner, buyer, holderA, holderB, stranger, VALIDATOR_ROLE, prop, otherProp, docA, docB };
}

async function submittedFixture() {
  const f = await deployFixture();
  await f.registry.connect(f.owner).submitDocument(f.docA, DocType.Escritura, f.prop, "");
  return f;
}

async function validatedFixture() {
  const f = await submittedFixture();
  await f.registry.connect(f.validator).validateDocument(f.docA);
  return f;
}

describe("DocumentRegistry", function () {
  describe("controle de acesso (#14)", function () {
    it("o admin concede e revoga o papel de validador", async function () {
      const { registry, admin, stranger, VALIDATOR_ROLE } = await loadFixture(deployFixture);
      await registry.connect(admin).grantRole(VALIDATOR_ROLE, stranger.address);
      expect(await registry.hasRole(VALIDATOR_ROLE, stranger.address)).to.equal(true);
      await registry.connect(admin).revokeRole(VALIDATOR_ROLE, stranger.address);
      expect(await registry.hasRole(VALIDATOR_ROLE, stranger.address)).to.equal(false);
    });

    it("quem não é admin não concede o papel", async function () {
      const { registry, stranger, VALIDATOR_ROLE } = await loadFixture(deployFixture);
      await expect(registry.connect(stranger).grantRole(VALIDATOR_ROLE, stranger.address)).to.be.revertedWithCustomError(
        registry,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("o validador não é admin (não concede o papel a terceiros)", async function () {
      const { registry, validator, stranger, VALIDATOR_ROLE } = await loadFixture(deployFixture);
      await expect(registry.connect(validator).grantRole(VALIDATOR_ROLE, stranger.address)).to.be.revertedWithCustomError(
        registry,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("não aceita admin zero no construtor", async function () {
      const Factory = await ethers.getContractFactory("DocumentRegistry");
      await expect(Factory.deploy(ethers.ZeroAddress)).to.be.revertedWith("admin zero");
    });
  });

  describe("submeter documento (#15)", function () {
    it("grava os dados corretos e emite o evento", async function () {
      const { registry, owner, prop, docA } = await loadFixture(deployFixture);
      const tx = await registry.connect(owner).submitDocument(docA, DocType.Escritura, prop, "bafy-cid");
      await expect(tx)
        .to.emit(registry, "DocumentSubmitted")
        .withArgs(docA, prop, owner.address, DocType.Escritura, "bafy-cid");

      const ts = BigInt(await time.latest());
      const d = await registry.verifyDocument(docA);
      expect(d.docType).to.equal(DocType.Escritura);
      expect(d.status).to.equal(Status.Pending);
      expect(d.propertyRef).to.equal(prop);
      expect(d.submitter).to.equal(owner.address);
      expect(d.submittedAt).to.equal(ts);
      expect(d.reviewer).to.equal(ethers.ZeroAddress);
      expect(d.reviewedAt).to.equal(0n);
      expect(d.reasonCode).to.equal(0);
      expect(d.cid).to.equal("bafy-cid");
    });

    it("hash duplicado reverte com erro claro", async function () {
      const { registry, buyer, prop, docA } = await loadFixture(submittedFixture);
      await expect(registry.connect(buyer).submitDocument(docA, DocType.Outro, prop, ""))
        .to.be.revertedWithCustomError(registry, "DocumentAlreadyExists")
        .withArgs(docA);
    });

    it("rejeita hash vazio e referência de imóvel vazia", async function () {
      const { registry, owner, prop, docA } = await loadFixture(deployFixture);
      await expect(registry.connect(owner).submitDocument(ethers.ZeroHash, DocType.Outro, prop, "")).to.be.revertedWithCustomError(
        registry,
        "EmptyDocHash"
      );
      await expect(registry.connect(owner).submitDocument(docA, DocType.Outro, ethers.ZeroHash, "")).to.be.revertedWithCustomError(
        registry,
        "EmptyPropertyRef"
      );
    });

    it("rejeita tipo de documento fora do enum", async function () {
      const { registry, owner, prop, docA } = await loadFixture(deployFixture);
      await expect(registry.connect(owner).submitDocument(docA, 6, prop, "")).to.be.reverted;
    });

    it("lista os documentos do imóvel na ordem de submissão", async function () {
      const { registry, owner, prop, docA, docB } = await loadFixture(deployFixture);
      await registry.connect(owner).submitDocument(docA, DocType.Escritura, prop, "");
      await registry.connect(owner).submitDocument(docB, DocType.Matricula, prop, "");
      expect(await registry.getDocumentsByProperty(prop)).to.deep.equal([docA, docB]);
    });
  });

  describe("validar e rejeitar (#16)", function () {
    it("somente o validador valida", async function () {
      const { registry, stranger, docA } = await loadFixture(submittedFixture);
      await expect(registry.connect(stranger).validateDocument(docA)).to.be.revertedWithCustomError(
        registry,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("valida: muda o status, guarda quem e quando, e emite o evento", async function () {
      const { registry, validator, prop, docA } = await loadFixture(submittedFixture);
      await expect(registry.connect(validator).validateDocument(docA))
        .to.emit(registry, "DocumentValidated")
        .withArgs(docA, prop, validator.address);
      const ts = BigInt(await time.latest());
      const d = await registry.verifyDocument(docA);
      expect(d.status).to.equal(Status.Validated);
      expect(d.reviewer).to.equal(validator.address);
      expect(d.reviewedAt).to.equal(ts);
    });

    it("rejeita com motivo: guarda o código e emite o evento", async function () {
      const { registry, validator, prop, docA } = await loadFixture(submittedFixture);
      await expect(registry.connect(validator).rejectDocument(docA, 3))
        .to.emit(registry, "DocumentRejected")
        .withArgs(docA, prop, validator.address, 3);
      const d = await registry.verifyDocument(docA);
      expect(d.status).to.equal(Status.Rejected);
      expect(d.reasonCode).to.equal(3);
      expect(d.reviewer).to.equal(validator.address);
    });

    it("somente o validador rejeita", async function () {
      const { registry, owner, docA } = await loadFixture(submittedFixture);
      await expect(registry.connect(owner).rejectDocument(docA, 1)).to.be.revertedWithCustomError(
        registry,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("aceita os códigos de rejeição 1, 2, 3, 4 e 99 e recusa os demais", async function () {
      const { registry, validator, docA } = await loadFixture(submittedFixture);
      for (const bad of [0, 5, 6, 7, 98, 100, 255]) {
        await expect(registry.connect(validator).rejectDocument(docA, bad))
          .to.be.revertedWithCustomError(registry, "InvalidReasonCode")
          .withArgs(bad);
      }
      for (const ok of [1, 2, 4, 99]) {
        const f = await deployFixture();
        await f.registry.connect(f.owner).submitDocument(f.docA, DocType.Outro, f.prop, "");
        await expect(f.registry.connect(f.validator).rejectDocument(f.docA, ok)).to.emit(f.registry, "DocumentRejected");
      }
    });

    it("documento inexistente reverte", async function () {
      const { registry, validator, docB } = await loadFixture(submittedFixture);
      await expect(registry.connect(validator).validateDocument(docB))
        .to.be.revertedWithCustomError(registry, "DocumentNotFound")
        .withArgs(docB);
      await expect(registry.connect(validator).rejectDocument(docB, 1)).to.be.revertedWithCustomError(registry, "DocumentNotFound");
    });

    it("transições inválidas revertem (só Pending pode ser validado ou rejeitado)", async function () {
      const { registry, validator, docA } = await loadFixture(validatedFixture);
      await expect(registry.connect(validator).validateDocument(docA))
        .to.be.revertedWithCustomError(registry, "InvalidStatus")
        .withArgs(docA, Status.Validated);
      await expect(registry.connect(validator).rejectDocument(docA, 1)).to.be.revertedWithCustomError(registry, "InvalidStatus");
    });

    it("documento rejeitado não pode ser validado depois", async function () {
      const { registry, validator, docA } = await loadFixture(submittedFixture);
      await registry.connect(validator).rejectDocument(docA, 1);
      await expect(registry.connect(validator).validateDocument(docA))
        .to.be.revertedWithCustomError(registry, "InvalidStatus")
        .withArgs(docA, Status.Rejected);
    });
  });

  describe("revogar (#17)", function () {
    it("revoga um documento validado e ele continua consultável com status e motivo", async function () {
      const { registry, validator, prop, docA } = await loadFixture(validatedFixture);
      await expect(registry.connect(validator).revokeDocument(docA, 5))
        .to.emit(registry, "DocumentRevoked")
        .withArgs(docA, prop, validator.address, 5);
      const d = await registry.verifyDocument(docA);
      expect(d.status).to.equal(Status.Revoked);
      expect(d.reasonCode).to.equal(5);
      expect(d.submitter).to.not.equal(ethers.ZeroAddress); // histórico preservado
      expect(await registry.getDocumentsByProperty(prop)).to.deep.equal([docA]);
    });

    it("só revoga a partir de Validated", async function () {
      const { registry, validator, docA } = await loadFixture(submittedFixture);
      await expect(registry.connect(validator).revokeDocument(docA, 5))
        .to.be.revertedWithCustomError(registry, "InvalidStatus")
        .withArgs(docA, Status.Pending);
    });

    it("não revoga duas vezes", async function () {
      const { registry, validator, docA } = await loadFixture(validatedFixture);
      await registry.connect(validator).revokeDocument(docA, 6);
      await expect(registry.connect(validator).revokeDocument(docA, 6)).to.be.revertedWithCustomError(registry, "InvalidStatus");
    });

    it("somente o validador revoga", async function () {
      const { registry, owner, docA } = await loadFixture(validatedFixture);
      await expect(registry.connect(owner).revokeDocument(docA, 4)).to.be.revertedWithCustomError(
        registry,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("aceita os códigos de revogação 4, 5, 6 e 99 e recusa os demais", async function () {
      const { registry, validator, docA } = await loadFixture(validatedFixture);
      for (const bad of [0, 1, 2, 3, 7, 98, 100]) {
        await expect(registry.connect(validator).revokeDocument(docA, bad))
          .to.be.revertedWithCustomError(registry, "InvalidReasonCode")
          .withArgs(bad);
      }
      await expect(registry.connect(validator).revokeDocument(docA, 99)).to.emit(registry, "DocumentRevoked");
    });

    it("documento inexistente reverte", async function () {
      const { registry, validator, docB } = await loadFixture(validatedFixture);
      await expect(registry.connect(validator).revokeDocument(docB, 4)).to.be.revertedWithCustomError(registry, "DocumentNotFound");
    });
  });

  describe("atestar titular (#1)", function () {
    it("atesta com base em documento validado e emite o evento", async function () {
      const { registry, validator, holderA, prop, docA } = await loadFixture(validatedFixture);
      await expect(registry.connect(validator).attestHolder(prop, holderA.address, docA))
        .to.emit(registry, "HolderAttested")
        .withArgs(prop, holderA.address, docA, validator.address);
      expect(await registry.latestAttestedHolder(prop)).to.equal(holderA.address);
    });

    it("mantém o histórico de titulares em ordem", async function () {
      const { registry, validator, owner, holderA, holderB, prop, docA, docB } = await loadFixture(validatedFixture);
      await registry.connect(validator).attestHolder(prop, holderA.address, docA);
      await registry.connect(owner).submitDocument(docB, DocType.ContratoCompraVenda, prop, "");
      await registry.connect(validator).validateDocument(docB);
      await registry.connect(validator).attestHolder(prop, holderB.address, docB);

      const history = await registry.getHolderHistory(prop);
      expect(history.length).to.equal(2);
      expect(history[0].holder).to.equal(holderA.address);
      expect(history[0].basisDocHash).to.equal(docA);
      expect(history[0].attestedBy).to.equal(validator.address);
      expect(history[1].holder).to.equal(holderB.address);
      expect(history[1].basisDocHash).to.equal(docB);
      expect(await registry.latestAttestedHolder(prop)).to.equal(holderB.address);
    });

    it("sem documento validado reverte (pendente, rejeitado, revogado ou inexistente)", async function () {
      const { registry, validator, owner, holderA, prop, docA, docB } = await loadFixture(submittedFixture);
      // Pending
      await expect(registry.connect(validator).attestHolder(prop, holderA.address, docA))
        .to.be.revertedWithCustomError(registry, "BasisDocumentNotValidated")
        .withArgs(docA);
      // Rejected
      await registry.connect(validator).rejectDocument(docA, 1);
      await expect(registry.connect(validator).attestHolder(prop, holderA.address, docA)).to.be.revertedWithCustomError(
        registry,
        "BasisDocumentNotValidated"
      );
      // Revoked
      await registry.connect(owner).submitDocument(docB, DocType.Certidao, prop, "");
      await registry.connect(validator).validateDocument(docB);
      await registry.connect(validator).revokeDocument(docB, 5);
      await expect(registry.connect(validator).attestHolder(prop, holderA.address, docB)).to.be.revertedWithCustomError(
        registry,
        "BasisDocumentNotValidated"
      );
      // Inexistente
      await expect(
        registry.connect(validator).attestHolder(prop, holderA.address, sha256Of("nao-existe"))
      ).to.be.revertedWithCustomError(registry, "BasisDocumentNotValidated");
    });

    it("documento de outro imóvel reverte", async function () {
      const { registry, validator, holderA, otherProp, docA } = await loadFixture(validatedFixture);
      await expect(registry.connect(validator).attestHolder(otherProp, holderA.address, docA))
        .to.be.revertedWithCustomError(registry, "BasisDocumentOtherProperty")
        .withArgs(docA, otherProp);
    });

    it("titular zero reverte", async function () {
      const { registry, validator, prop, docA } = await loadFixture(validatedFixture);
      await expect(registry.connect(validator).attestHolder(prop, ethers.ZeroAddress, docA)).to.be.revertedWithCustomError(
        registry,
        "InvalidHolder"
      );
    });

    it("somente o validador atesta", async function () {
      const { registry, owner, holderA, prop, docA } = await loadFixture(validatedFixture);
      await expect(registry.connect(owner).attestHolder(prop, holderA.address, docA)).to.be.revertedWithCustomError(
        registry,
        "AccessControlUnauthorizedAccount"
      );
    });
  });

  describe("consultas sem carteira (#18)", function () {
    it("hash não cadastrado volta com status None", async function () {
      const { registry, docB } = await loadFixture(deployFixture);
      const d = await registry.verifyDocument(docB);
      expect(d.status).to.equal(Status.None);
      expect(d.submitter).to.equal(ethers.ZeroAddress);
    });

    it("imóvel sem documentos ou sem titular volta vazio", async function () {
      const { registry, prop } = await loadFixture(deployFixture);
      expect(await registry.getDocumentsByProperty(prop)).to.deep.equal([]);
      expect(await registry.getHolderHistory(prop)).to.deep.equal([]);
      expect(await registry.latestAttestedHolder(prop)).to.equal(ethers.ZeroAddress);
    });

    it("todas as consultas funcionam por provedor somente leitura (sem assinante)", async function () {
      const { registry, prop, docA } = await loadFixture(validatedFixture);
      const readOnly = registry.connect(ethers.provider);
      const d = await readOnly.verifyDocument(docA);
      expect(d.status).to.equal(Status.Validated);
      expect(await readOnly.getDocumentsByProperty(prop)).to.deep.equal([docA]);
      expect(await readOnly.getHolderHistory(prop)).to.deep.equal([]);
      expect(await readOnly.latestAttestedHolder(prop)).to.equal(ethers.ZeroAddress);
    });
  });

  describe("fluxo completo (caso do Seu José, dados fictícios)", function () {
    it("cadastrar → validar → atestar titular → verificar → substituir e revogar", async function () {
      const { registry, validator, owner, holderA, holderB, prop, docA, docB } = await loadFixture(deployFixture);

      await registry.connect(owner).submitDocument(docA, DocType.ComprovantePosse, prop, "");
      await registry.connect(validator).validateDocument(docA);
      await registry.connect(validator).attestHolder(prop, holderA.address, docA);

      await registry.connect(owner).submitDocument(docB, DocType.Escritura, prop, "");
      await registry.connect(validator).validateDocument(docB);
      await registry.connect(validator).attestHolder(prop, holderB.address, docB);
      await registry.connect(validator).revokeDocument(docA, 4); // substituído por versão mais recente

      expect((await registry.verifyDocument(docA)).status).to.equal(Status.Revoked);
      expect((await registry.verifyDocument(docB)).status).to.equal(Status.Validated);
      expect(await registry.latestAttestedHolder(prop)).to.equal(holderB.address);
      expect((await registry.getHolderHistory(prop)).length).to.equal(2);
      expect(await registry.getDocumentsByProperty(prop)).to.deep.equal([docA, docB]);
    });
  });
});
