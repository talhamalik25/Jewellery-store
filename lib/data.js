export const categories = [
  { name: "Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85", count: "A little something" },
  { name: "Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85", count: "Made to be noticed" },
  { name: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85", count: "Close to your heart" },
  { name: "Bracelets", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85", count: "Everyday keepsakes" },
];

export const products = [
  { id: "solitaire-ring", name: "Solitaire Ring", price: 185, category: "Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85", description: "A luminous stone, held in a delicate recycled gold setting. Made for the moments that stay with you.", stock: 8 },
  { id: "pearl-drop-earrings", name: "Pearl Drop Earrings", price: 120, category: "Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85", description: "Freshwater pearls and sculpted gold meet in an easy, graceful silhouette.", stock: 12 },
  { id: "everyday-chain", name: "Everyday Chain", price: 148, category: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85", description: "A fine, softly shining chain designed to be worn alone or layered your way.", stock: 6 },
  { id: "twisted-bangle", name: "Twisted Bangle", price: 165, category: "Bracelets", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=85", description: "A considered twist on a timeless form, finished by hand in warm gold.", stock: 0 },
  { id: "sculpted-hoops", name: "Sculpted Hoops", price: 132, category: "Earrings", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85", description: "Lightweight hoops with an organic, sculptural profile for everyday wear.", stock: 9 },
  { id: "signet-ring", name: "Petite Signet Ring", price: 175, category: "Rings", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85", description: "A modern heirloom with a softly rounded face and polished finish.", stock: 4 },
  { id: "coin-pendant", name: "Coin Pendant", price: 158, category: "Necklaces", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=85", description: "A delicate pendant with subtle texture, suspended from a fine gold chain.", stock: 11 },
  { id: "slim-chain-bracelet", name: "Slim Chain Bracelet", price: 98, category: "Bracelets", image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=85", description: "A refined, adjustable chain that brings a quiet glimmer to your wrist.", stock: 14 },
  { id: "pearl-studs", name: "Pearl Studs", price: 88, category: "Earrings", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=85", description: "A pair of luminous freshwater pearls in simple, gold vermeil settings.", stock: 18 },
  { id: "layered-necklace", name: "Layered Necklace", price: 210, category: "Necklaces", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=85", description: "Two fine chains, thoughtfully paired for an effortless layered look.", stock: 5 },
];

export const formatPrice = (price) => `$${price.toFixed(2)}`;
