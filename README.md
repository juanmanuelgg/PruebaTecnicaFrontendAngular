# Pokémon Gallery - PokéAPI Explorer

![Pokémon Gallery](https://github.com/user-attachments/assets/d7528465-7dbe-4bea-8f97-cfafb21401c2)

A beautiful Angular 19 web application that consumes the PokéAPI to display a gallery of 30 random Pokémon with their names, images, abilities, and types. Each Pokémon card has a call-to-action button that opens a detailed modal view, with the URL reflecting the current state for direct access.

## ✨ Features

- 🎲 **Random Pokémon Gallery**: Displays 30 randomly selected Pokémon
- 🖼️ **Beautiful UI**: Modern, responsive design using Bootstrap with custom gradient styling
- 📝 **Normalized Names**: Pokémon names are properly formatted (capitalized, spaces instead of hyphens)
- 🎨 **Type-Colored Badges**: Each Pokémon type displays with its official color
- ⚡ **Abilities Display**: Shows all abilities for each Pokémon
- 🔍 **Detail Modal**: Click any Pokémon to see detailed information in a modal/drawer
- 🔗 **URL Routing**: Modal state is reflected in the URL (e.g., `/pokemon/25` for Pikachu)
- 🌐 **Direct Access**: Share URLs to specific Pokémon details
- 🔄 **Refresh Button**: Load a new set of 30 random Pokémon
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 🛠️ Technologies Used

- **Angular 19.2.18**: Modern web framework (upgraded from 16 for security patches)
- **TypeScript**: Type-safe development
- **Bootstrap 5**: Responsive UI components and styling
- **SCSS**: Enhanced styling capabilities
- **PokéAPI**: RESTful Pokémon data API
- **RxJS**: Reactive programming for API calls

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/juanmanuelgg/PruebaTecnicaFrontendAngular.git
cd PruebaTecnicaFrontendAngular
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200/`

## 📦 Build

Build the project for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/pokemon-app/` directory.

## 🌐 Deployment

### Deploy to GCP VM Instance (Recommended for Custom Infrastructure)

For detailed instructions on deploying to Google Cloud Platform VM, see [GCP Deployment Guide](deployment/GCP-DEPLOYMENT.md).

**Quick deployment with automated script:**
```bash
# 1. Create GCP VM instance
gcloud compute instances create pokemon-app-vm \
    --zone=us-central1-a \
    --machine-type=e2-micro \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --tags=http-server

# 2. Configure firewall
gcloud compute firewall-rules create allow-http \
    --allow tcp:80 \
    --target-tags http-server

# 3. SSH and deploy
gcloud compute ssh pokemon-app-vm --zone=us-central1-a
git clone https://github.com/juanmanuelgg/PruebaTecnicaFrontendAngular.git
cd PruebaTecnicaFrontendAngular
chmod +x deployment/deploy-gcp-vm.sh
./deployment/deploy-gcp-vm.sh
```

**Or deploy with Docker:**
```bash
# On your GCP VM
git clone https://github.com/juanmanuelgg/PruebaTecnicaFrontendAngular.git
cd PruebaTecnicaFrontendAngular

# Using Docker Compose
docker-compose up -d

# Or using Docker directly
docker build -t pokemon-app .
docker run -d -p 80:80 pokemon-app
```

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist/pokemon-app` folder to Netlify via:
   - Netlify CLI: `netlify deploy --prod --dir=dist/pokemon-app`
   - Netlify Dashboard: Drag and drop the `dist/pokemon-app` folder

### Deploy to GitHub Pages

1. Install Angular CLI GitHub Pages:
```bash
npm install -g angular-cli-ghpages
```

2. Build and deploy:
```bash
ng build --configuration production --base-href "/PruebaTecnicaFrontendAngular/"
npx angular-cli-ghpages --dir=dist/pokemon-app
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── pokemon-gallery/    # Main gallery component
│   │   ├── pokemon-card/        # Individual Pokémon card
│   │   └── pokemon-detail/      # Detail modal component
│   ├── services/
│   │   └── pokemon.service.ts   # PokéAPI service
│   ├── models/
│   │   └── pokemon.model.ts     # TypeScript interfaces
│   ├── utils/
│   │   └── pokemon-types.util.ts # Shared utilities for type colors
│   ├── app-routing.module.ts    # Route configuration
│   └── app.module.ts            # Main module
├── styles.scss                   # Global styles
└── index.html                    # Main HTML file

deployment/
├── deploy-gcp-vm.sh              # Automated GCP VM deployment script
├── GCP-DEPLOYMENT.md             # Comprehensive GCP deployment guide
└── nginx.conf                    # Nginx configuration for production

Dockerfile                        # Docker container configuration
docker-compose.yml                # Docker Compose orchestration
```

## 🎯 Key Implementation Details

### API Integration
- Uses Angular's `HttpClient` for API calls
- Implements `forkJoin` to fetch 30 Pokémon concurrently
- Proper error handling with fallback mechanisms
- Type-safe data transformation from API response to local models

### Routing
- Gallery route: `/`
- Detail route: `/pokemon/:id`
- URL state management for modal visibility
- Deep linking support for direct access to Pokémon details

### UX Best Practices
- Loading states with spinners
- Hover effects and transitions
- Gradient animations
- Card hover effects with shadow
- Type-specific color coding
- Responsive grid layout
- Accessible modal implementation

### Component Architecture
- **Gallery Component**: Manages Pokémon list and modal state
- **Card Component**: Reusable Pokémon card with hover effects
- **Detail Component**: Rich detail view with additional information
- **Service Layer**: Centralized API logic with data transformation

## 🧪 API Used

This project consumes the [PokéAPI](https://pokeapi.co/), a free RESTful API providing comprehensive Pokémon data.

**Endpoints Used:**
- `GET https://pokeapi.co/api/v2/pokemon/{id}` - Fetch individual Pokémon data

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Juan Manuel González**
- Portfolio: Prueba Técnica Frontend Angular
- Repository: [PruebaTecnicaFrontendAngular](https://github.com/juanmanuelgg/PruebaTecnicaFrontendAngular)

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing the Pokémon data
- [Angular](https://angular.io/) for the amazing framework
- [Bootstrap](https://getbootstrap.com/) for the UI components

