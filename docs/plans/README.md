# Planos de Implementação

Este diretório contém os planos de implementação do TáComQuem Frontend, organizados por iniciativa.

## Estrutura

```
plans/
├── README.md                    # Este arquivo
└── NNN-<nome-da-iniciativa>/    # Pasta por iniciativa
    ├── design.md                # Documento de design (o que construir)
    ├── implementation.md        # Plano de implementação (como construir)
    └── assets/                  # Mockups, diagramas, etc.
```

## Convenções

- **Numeração:** Iniciativas são numeradas sequencialmente (001, 002, ...)
- **Nomenclatura:** `NNN-nome-em-kebab-case`
- **Design primeiro:** Sempre criar `design.md` antes de implementar
- **Implementação:** Criar `implementation.md` quando for executar

## Iniciativas

| # | Nome | Status | Descrição |
|---|------|--------|-----------|
| 001 | [frontend-setup](./001-frontend-setup/) | ✅ Concluído | Setup do projeto Next.js com Bun, TypeScript, Tailwind, shadcn/ui |
| 002 | [dashboard-implementation](./002-dashboard-implementation/) | 📋 Pronto para implementar | Dashboard client-side com React Query, design único, dados reais da API |
