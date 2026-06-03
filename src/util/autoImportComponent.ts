export function getRouteComponents() {
  const modules = import.meta.glob('../**/*.vue', { eager: true, import: 'default' })
  return { modules }
}
