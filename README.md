ShopSphere AI
ShopSphere AI is a frontend-focused e-commerce demo built with Next.js, React, TypeScript, and Tailwind CSS. It demonstrates product discovery, cart and wishlist interactions, mock checkout, order history, product recommendations, a rule-based shopping assistant, and a simulated admin area.
Project note: This is a frontend-only demo. Cart, wishlist, products, orders, and demo admin authentication use browser storage/local mock data. It does not include a production backend, database, real payment gateway, or external AI API.

Features
Customer experience
- Responsive home page and product browsing
- Product search and category filtering
- Product detail pages
- Add to cart, change quantities, and remove items
- Wishlist management
- Simulated checkout and order confirmation
- Order history and order tracking timeline
- Product recommendations based on simple local rules
- Rule-based shopping assistant
- Profile page
Admin demo
- Admin dashboard and product management
- Orders, customers, analytics, and settings pages
- Demo login state stored in browser storage
- Local product/order data for demonstration
Admin authentication is simulated for a portfolio/demo only. Do not use it to protect real customer or business data.

Tech stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Lucide React icons
- Browser localStorage / sessionStorage for demo persistence
Requirements
Install the current LTS version of Node.js from https://nodejs.org/. npm is included with Node.js.
Run locally
1. Download or clone this repository.
2. Open the project folder in a terminal.
3. Install dependencies:
   npm install
4. Start the development server:
   npm run dev
5. Open http://localhost:3000 in your browser.
Run commands from the folder that contains package.json. If npm reports that it cannot find package.json, navigate into the actual project directory first.
Build for production
npm run build
npm start
If the project does not have a start script, check package.json before running npm start.
Example project structure
Your exact folders may vary depending on the features implemented:
shopsphere-ai/
├── app/
│   ├── admin/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── products/
│   ├── profile/
│   ├── search/
│   ├── wishlist/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AIChat.tsx
│   ├── Footer.tsx
│   ├── HomeClient.tsx
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── RecommendationSection.tsx
│   └── ReviewsSection.tsx
├── lib/
│   ├── catalog.ts
│   ├── data.ts
│   ├── orders.ts
│   ├── recommendations.ts
│   ├── store.ts
│   └── types.ts
├── public/
├── package.json
└── README.md
This tree is illustrative. Keep the actual files in your repository rather than creating empty folders just to match the example.
Demo data and browser storage
The demo may store information in browser storage, including cart items, wishlist product IDs, product catalog changes, mock orders, and demo admin authentication state.
Because this is browser-local data, it is not shared between different browsers or devices. Clearing browser storage can remove demo data.
Publish the project to GitHub
Create a new empty repository on GitHub, for example shopsphere-ai. If your local project already has a README, do not initialize the GitHub repository with another README.
Open a terminal in the local project directory (the directory containing package.json) and run:
git init
git add .
git commit -m "Initial ShopSphere AI project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/shopsphere-ai.git
git push -u origin main
Replace YOUR-USERNAME with your GitHub username.
If Git says the remote origin already exists, check it:
git remote -v
Update it if needed:
git remote set-url origin https://github.com/YOUR-USERNAME/shopsphere-ai.git
Important before pushing
Make sure .gitignore excludes generated files and secrets. At minimum, avoid committing:
node_modules/
.next/
out/
.env
.env.*
!.env.example
Never upload passwords, access tokens, private keys, or real customer data.
Deployment
You can deploy a Next.js project to a compatible hosting provider such as Vercel. Import the GitHub repository, allow the platform to detect Next.js, configure any required environment variables, and deploy. The described frontend-only demo should not need environment variables unless your own code adds them.
After deployment, test the home page, product pages, search, cart, wishlist, checkout, orders, and admin demo routes.
Limitations
- No production backend or database
- No real payment processing
- No external AI service; recommendations and assistant responses are demo/rule-based
- Demo admin authentication is not secure production authentication
- Browser-local data is device/browser specific
Future improvements
- Add a secure backend and database
- Add real authentication and role-based access control
- Add automated tests and accessibility checks
- Add a payment provider only when ready for secure payment integration
- Improve recommendation quality with validated product/customer data
License
Choose a license before publishing the repository. If you have not chosen one, do not claim that the project is open-source under a specific license yet.
