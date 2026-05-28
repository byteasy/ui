export function getRouteComponents() {
  const modules = import.meta.glob('../views/**/*.vue', { eager: true, import: 'default' })
  return { modules }
}
