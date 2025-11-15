# Weiss-Gruber - Jeannette Weiss-Gruber Stained Glass Portfolio

A website dedicated to Jeannette Weiss-Gruber, a French stained glass artist (peintre-verrier) born in 1934. This digital catalogue raisonné showcases her life's work creating and restoring stained glass windows in churches and cathedrals across France.

**Live site**: [www.weiss-gruber.art](https://www.weiss-gruber.art)

## About the Project

This site was created to share the artistic journey of Jeannette Weiss Gruber, who dedicated her life to the art of stained glass. The website features:

- **Biography**: Her life, training, and artistic approach
- **Catalogue Raisonné**: A comprehensive collection of her preferred works with high-quality images
- **Interactive Map**: Geographic visualization of her works across France
- **Publications**: References to books and exhibitions featuring her work
- **Historical Monuments List**: Complete list of her creations in classified buildings

The digital format offers a unique quality of viewing — the screen's pixel light restores something of the stained glass transparency that paper often dulls.

## Technical Stack

- **Framework**: Next.js 15.0.3 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.1
- **Maps**: Leaflet with React-Leaflet
- **Image Lightbox**: yet-another-react-lightbox
- **Image Storage**: Scaleway Object Storage
- **Deployment**: Vercel
- **Development**: Co-developed with Windsurf AI

## Project Structure

```
src/
├── pages/
│   ├── index.tsx                 # Main landing page
│   ├── jeannette/
│   │   ├── index.tsx            # Jeannette's home page
│   │   ├── biography.tsx        # Biography page
│   │   ├── catalogue.tsx        # Catalogue raisonné overview
│   │   ├── catalogue/[id].tsx   # Individual artwork pages
│   │   ├── carte.tsx            # Interactive map
│   │   └── publications.tsx     # Publications & monuments list
│   ├── _app.tsx
│   └── _document.tsx
├── components/              # Reusable UI components
├── styles/
│   └── globals.css
└── types/                   # TypeScript type definitions

vitraux_metadata.csv         # Artwork metadata database
images/                      # Static images
public/                      # Public assets
```

## Data Structure

Artwork data is stored in `vitraux_metadata.csv` with the following fields:

- `id`: Unique identifier (e.g., `jw_1969_lyon_01`)
- `year`: Year of creation
- `building_name`: Name of the building
- `building_type`: Type (Église, Cathédrale, etc.)
- `city`, `department`: Location
- `location_in_building`: Specific location within building
- `title_fr`: French title/description
- `main_image`: Main image filename
- `description_fr`: Detailed description
- `gallery_images`: JSON array of additional images
- `maps_url`: Google Maps link
- `lat`, `lng`: Coordinates for map display

## How to Modify

### Adding a New Artwork

1. Add a new row to `vitraux_metadata.csv` with all required fields
2. Upload images to Vercel Blob Storage or Scaleway
3. Update the `main_image` field with the image URL
4. Add gallery images in JSON format if needed
5. The catalogue will automatically update

### Modifying Content

- **Biography**: Edit `src/pages/jeannette/biography.tsx`
- **Publications**: Edit `src/pages/jeannette/publications.tsx`
- **Home page text**: Edit `src/pages/jeannette/index.tsx`
- **Styling**: Modify Tailwind classes or `src/styles/globals.css`


### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/13w13/weiss-gruber.git
cd weiss-gruber
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## License & Reuse

### Code
The source code of this website is **open source** and can be reused without permission. Feel free to fork, modify, and adapt it for your own projects.

### Content & Images
Unless otherwise stated, photographs are the property of J.E.C. Gruber Weiss. Any reproduction, distribution, or use, even partial, is prohibited without prior authorization.

## Credits

- **Artist**: Jeannette Weiss-Gruber (1934-)
- **Photography**: Denis Krieger ([mesvitrauxfavoris.fr](https://www.mesvitrauxfavoris.fr/index.htm)) and family archives
- **Development**: Co-developed with Windsurf AI


## Acknowledgments

This catalogue raisonné is a partial and self-declarative work: information comes from Jeannette WeissnGruber's own archives and declarations, taken as true. It may contain inaccuracies, omissions, or approximations, and does not claim to cover the entirety of her work.

---

*"The stained glass is in my skin; when I make my full-size cartoons, the leading is already there."* — Jeannette Weiss-Gruber
