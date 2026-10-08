export type PortfolioItem = {
  id: string; title: string; category: 'Large scale' | 'Residential'; image: string; alt: string; width: number; height: number
}
// Descriptive labels, not official project names or claims of completed buildings.
export const portfolio: PortfolioItem[] = [
  { id: 'towers', title: 'Connected towers', category: 'Large scale', image: '/images/towers.jpg', alt: 'Architectural visualization of three waterfront towers with curved balconies and a connecting terrace.', width: 1440, height: 1440 },
  { id: 'office', title: 'Office building at dusk', category: 'Large scale', image: '/images/office.jpg', alt: 'Office building visualization with illuminated stone frames, glass façades and an urban street.', width: 1440, height: 1440 },
  { id: 'forest', title: 'Forest residence', category: 'Residential', image: '/images/forest.jpg', alt: 'Visualization of a low modern residence among tall trees with warm light and broad terraces.', width: 1440, height: 1440 },
  { id: 'villa', title: 'Contemporary villa', category: 'Residential', image: '/images/villa.jpg', alt: 'White contemporary villa visualization with deep roof overhangs, glass balconies and vertical screens.', width: 1440, height: 1440 },
  { id: 'curved', title: 'Curved urban façades', category: 'Large scale', image: '/images/curved.jpg', alt: 'Urban building visualization with rounded white balcony edges and a glazed ground floor.', width: 1440, height: 1440 },
  { id: 'lake', title: 'Lakeside residence', category: 'Residential', image: '/images/lake.jpg', alt: 'Pale architectural visualization of a cantilevered lakeside residence surrounded by trees.', width: 1440, height: 1440 },
  { id: 'glass', title: 'Glass towers', category: 'Large scale', image: '/images/glass.jpg', alt: 'Visualization of tall glass office towers above landscaped terraces and a public plaza.', width: 1440, height: 1440 },
  { id: 'urban', title: 'Urban residence', category: 'Residential', image: '/images/urban.jpg', alt: 'Front elevation visualization of a narrow urban residence with planted balconies and timber screens.', width: 1254, height: 1254 },
  { id: 'skyline', title: 'A view through the trees', category: 'Large scale', image: '/images/skyline.jpg', alt: 'Vertical architectural visualization of a stepped tower seen above trees beneath an open sky.', width: 640, height: 1136 },
]
export const film: { src: string | null; poster: string; title: string } = {
  // Set only after a generated clip passes visual review.
  src: '/media/sac-towers.mp4', poster: '/images/towers.jpg', title: 'Connected towers · Architectural film',
}
export const contact = { instagram: 'https://www.instagram.com/_sac_architects/', whatsapp: 'https://wa.me/919573825468' }
