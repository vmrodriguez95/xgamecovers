// Carga automática de todos los componentes dentro de /components
import.meta.glob('./elements/**/*.ts', { eager: true })
import.meta.glob('./components/**/*.ts', { eager: true })
import.meta.glob('./views/**/*.ts', { eager: true })

// Importa todos los archivos .scss de src/styles
import.meta.glob('./styles/**/*.scss', { eager: true });
