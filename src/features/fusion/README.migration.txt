Migración propuesta para feature 'fusion'

- Crear `src/features/fusion` (hecho)
- Mover lógica existente de fusión desde donde esté (buscar por `fusion` o por archivos relacionados)
- Actualizar imports: por ejemplo, cambiar `import { x } from '../../somewhere'` a `import { x } from 'src/features/fusion/...'
- Añadir barrels en `components/index.ts`, `services/index.ts`, y `hooks/index.ts` para exponer API.
- Ejecutar `npm run build`/`pnpm build` o `vite` para verificar errores de paths y corregir.

Sugerencias:
- Mantener tests o un archivo `example.test.ts` con casos simples de fusión para validación rápida.
- Añadir `assets/` en la feature para sprites y sonidos.
