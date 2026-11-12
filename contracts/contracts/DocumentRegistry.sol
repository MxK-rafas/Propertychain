// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title DocumentRegistry
 * @notice Verificação pública de documentos imobiliários. Guarda o hash (SHA-256) de
 *         documentos, a decisão de um validador (cartório SIMULADO) e a atestação de titular
 *         constante nos documentos.
 *
 * @dev PROTÓTIPO EDUCACIONAL EM REDE DE TESTES. Sem valor legal. Não substitui o registro no
 *      Cartório de Registro de Imóveis. Não há token do imóvel, não há vínculo com a matrícula
 *      e nenhum dado pessoal em claro. Ver docs/ESCOPO_JURIDICO.md.
 */
contract DocumentRegistry is AccessControl {
    // ---------------------------------------------------------------- papéis

    /// @notice Papel do cartório simulado: valida, rejeita, revoga e atesta titular.
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    // ---------------------------------------------------------------- tipos

    enum DocType {
        Matricula,
        Escritura,
        ContratoCompraVenda,
        Certidao,
        ComprovantePosse,
        Outro
    }

    /// @dev None (0) significa "hash não cadastrado".
    enum Status {
        None,
        Pending,
        Validated,
        Rejected,
        Revoked
    }

    struct Document {
        DocType docType;
        Status status;
        bytes32 propertyRef; // referência opaca do imóvel (ADR 0005)
        address submitter;
        uint64 submittedAt;
        address reviewer; // quem validou, rejeitou ou revogou por último
        uint64 reviewedAt;
        uint8 reasonCode; // motivo de rejeição/revogação; 0 se não houver
        string cid; // opcional: cópia criptografada fora da chain
    }

    /// @notice Atestação feita pelo validador sobre quem CONSTA como titular nos documentos.
    ///         Não é título de propriedade.
    struct HolderAttestation {
        address holder;
        bytes32 basisDocHash;
        address attestedBy;
        uint64 attestedAt;
    }

    // ---------------------------------------------------------------- códigos de motivo
    // Rascunho em docs/ARQUITETURA.md (issue #11).
    // 1 ilegível/incompleto · 2 dados divergentes · 3 suspeita de adulteração/fraude
    // 4 substituído por versão mais recente · 5 decisão judicial/administrativa
    // 6 erro de validação reconhecido · 99 outro

    // ---------------------------------------------------------------- estado

    mapping(bytes32 docHash => Document) private _documents;
    mapping(bytes32 propertyRef => bytes32[]) private _docsByProperty;
    mapping(bytes32 propertyRef => HolderAttestation[]) private _holders;

    // ---------------------------------------------------------------- eventos

    event DocumentSubmitted(
        bytes32 indexed docHash,
        bytes32 indexed propertyRef,
        address indexed submitter,
        DocType docType,
        string cid
    );
    event DocumentValidated(bytes32 indexed docHash, bytes32 indexed propertyRef, address indexed reviewer);
    event DocumentRejected(
        bytes32 indexed docHash,
        bytes32 indexed propertyRef,
        address indexed reviewer,
        uint8 reasonCode
    );
    event DocumentRevoked(
        bytes32 indexed docHash,
        bytes32 indexed propertyRef,
        address indexed reviewer,
        uint8 reasonCode
    );
    event HolderAttested(
        bytes32 indexed propertyRef,
        address indexed holder,
        bytes32 indexed basisDocHash,
        address attestedBy
    );

    // ---------------------------------------------------------------- erros

    error EmptyDocHash();
    error EmptyPropertyRef();
    error DocumentAlreadyExists(bytes32 docHash);
    error DocumentNotFound(bytes32 docHash);
    error InvalidStatus(bytes32 docHash, Status current);
    error InvalidReasonCode(uint8 reasonCode);
    error InvalidHolder();
    error BasisDocumentNotValidated(bytes32 basisDocHash);
    error BasisDocumentOtherProperty(bytes32 basisDocHash, bytes32 propertyRef);

    // ---------------------------------------------------------------- construtor

    /// @param admin Conta que administra os papéis (concede e revoga VALIDATOR_ROLE).
    constructor(address admin) {
        require(admin != address(0), "admin zero");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    // ---------------------------------------------------------------- escrita

    /// @notice Qualquer pessoa submete o hash de um documento. Nasce Pending.
    /// @param docHash SHA-256 do arquivo, calculado no navegador.
    /// @param propertyRef Referência opaca do imóvel: keccak256(matrícula + cartório + salt).
    /// @param cid Opcional: identificador de cópia criptografada fora da chain ("" se não houver).
    function submitDocument(
        bytes32 docHash,
        DocType docType,
        bytes32 propertyRef,
        string calldata cid
    ) external {
        if (docHash == bytes32(0)) revert EmptyDocHash();
        if (propertyRef == bytes32(0)) revert EmptyPropertyRef();
        if (_documents[docHash].status != Status.None) revert DocumentAlreadyExists(docHash);

        _documents[docHash] = Document({
            docType: docType,
            status: Status.Pending,
            propertyRef: propertyRef,
            submitter: msg.sender,
            submittedAt: uint64(block.timestamp),
            reviewer: address(0),
            reviewedAt: 0,
            reasonCode: 0,
            cid: cid
        });
        _docsByProperty[propertyRef].push(docHash);

        emit DocumentSubmitted(docHash, propertyRef, msg.sender, docType, cid);
    }

    /// @notice Validador marca um documento Pending como Validated.
    function validateDocument(bytes32 docHash) external onlyRole(VALIDATOR_ROLE) {
        Document storage doc = _requireStatus(docHash, Status.Pending);
        doc.status = Status.Validated;
        doc.reviewer = msg.sender;
        doc.reviewedAt = uint64(block.timestamp);

        emit DocumentValidated(docHash, doc.propertyRef, msg.sender);
    }

    /// @notice Validador rejeita um documento Pending.
    function rejectDocument(bytes32 docHash, uint8 reasonCode) external onlyRole(VALIDATOR_ROLE) {
        if (!_isRejectionReason(reasonCode)) revert InvalidReasonCode(reasonCode);
        Document storage doc = _requireStatus(docHash, Status.Pending);
        doc.status = Status.Rejected;
        doc.reviewer = msg.sender;
        doc.reviewedAt = uint64(block.timestamp);
        doc.reasonCode = reasonCode;

        emit DocumentRejected(docHash, doc.propertyRef, msg.sender, reasonCode);
    }

    /// @notice Validador revoga um documento Validated. Nada é apagado: o histórico permanece.
    function revokeDocument(bytes32 docHash, uint8 reasonCode) external onlyRole(VALIDATOR_ROLE) {
        if (!_isRevocationReason(reasonCode)) revert InvalidReasonCode(reasonCode);
        Document storage doc = _requireStatus(docHash, Status.Validated);
        doc.status = Status.Revoked;
        doc.reviewer = msg.sender;
        doc.reviewedAt = uint64(block.timestamp);
        doc.reasonCode = reasonCode;

        emit DocumentRevoked(docHash, doc.propertyRef, msg.sender, reasonCode);
    }

    /// @notice Validador atesta quem CONSTA como titular em um documento validado do imóvel.
    ///         É uma atestação sobre documentos, não um título de propriedade.
    function attestHolder(
        bytes32 propertyRef,
        address holder,
        bytes32 basisDocHash
    ) external onlyRole(VALIDATOR_ROLE) {
        if (holder == address(0)) revert InvalidHolder();

        Document storage basis = _documents[basisDocHash];
        if (basis.status != Status.Validated) revert BasisDocumentNotValidated(basisDocHash);
        if (basis.propertyRef != propertyRef) revert BasisDocumentOtherProperty(basisDocHash, propertyRef);

        _holders[propertyRef].push(
            HolderAttestation({
                holder: holder,
                basisDocHash: basisDocHash,
                attestedBy: msg.sender,
                attestedAt: uint64(block.timestamp)
            })
        );

        emit HolderAttested(propertyRef, holder, basisDocHash, msg.sender);
    }

    // ---------------------------------------------------------------- consultas (públicas e gratuitas)

    /// @notice Dados de um documento. `status == None` significa "não encontrado".
    function verifyDocument(bytes32 docHash) external view returns (Document memory) {
        return _documents[docHash];
    }

    /// @notice Hashes dos documentos vinculados a um imóvel, na ordem de submissão.
    function getDocumentsByProperty(bytes32 propertyRef) external view returns (bytes32[] memory) {
        return _docsByProperty[propertyRef];
    }

    /// @notice Histórico de titulares atestados de um imóvel, do mais antigo ao mais recente.
    function getHolderHistory(bytes32 propertyRef) external view returns (HolderAttestation[] memory) {
        return _holders[propertyRef];
    }

    /// @notice Último titular atestado nos documentos (address(0) se não houver).
    ///         Não indica propriedade legal.
    function latestAttestedHolder(bytes32 propertyRef) external view returns (address) {
        uint256 n = _holders[propertyRef].length;
        if (n == 0) return address(0);
        return _holders[propertyRef][n - 1].holder;
    }

    // ---------------------------------------------------------------- internos

    function _requireStatus(bytes32 docHash, Status expected) private view returns (Document storage doc) {
        doc = _documents[docHash];
        if (doc.status == Status.None) revert DocumentNotFound(docHash);
        if (doc.status != expected) revert InvalidStatus(docHash, doc.status);
    }

    /// @dev Rejeição: 1, 2, 3, 4 ou 99.
    function _isRejectionReason(uint8 code) private pure returns (bool) {
        return (code >= 1 && code <= 4) || code == 99;
    }

    /// @dev Revogação: 4, 5, 6 ou 99.
    function _isRevocationReason(uint8 code) private pure returns (bool) {
        return (code >= 4 && code <= 6) || code == 99;
    }
}
