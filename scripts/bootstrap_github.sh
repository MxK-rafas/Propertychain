#!/usr/bin/env bash
# O backlog já foi conciliado com as issues existentes.
# Este script agora apenas consulta; não cria issues, labels ou milestones.
set -euo pipefail
REPO="${1:-MxK-rafas/Propertychain}"
gh issue list --repo "$REPO" --state all --limit 100
