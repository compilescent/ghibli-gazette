import { Redis } from "@upstash/redis"
import { type Post } from "@/lib/types"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || ""
})

export const mangaArticle: Post = {
  id: "most-iconic-manga-panels-jjk-mahoraga-gear-5",
  title: "The Most Iconic Manga Panels in Modern Shonen: From JJK's Mahoraga to One Piece Gear 5",
  excerpt:
    "A deep dive into the legendary double-page spreads that defined a generation: Gege Akutami's Mahoraga summoning, Eiichiro Oda's Joyboy silhouette, Tatsuki Fujimoto's Darkness Devil, and Tite Kubo's ink mastery.",
  content: `
    <p>A truly great manga panel is more than just illustration—it is a visual shockwave. When master mangaka combine composition, pacing, negative space, and emotional payoff, a single black-and-white spread can freeze an entire fandom in collective awe.</p>
    
    <p>Here is an in-depth breakdown of the most iconic, game-changing manga panels in modern shonen history and the artistic techniques that made them legendary.</p>

    <h2>1. Jujutsu Kaisen — "With This Treasure, I Summon..." (The Descent of Mahoraga)</h2>
    
    <div class="manga-quote">
      "Eight-Handled Sword Divergent Sila Divine General Mahoraga." — Megumi Fushiguro (Chapter 117)
    </div>

    <p>In the ruins of Shibuya, Megumi Fushiguro is pushed past his absolute limit by Haruta Shigemo. Rather than dying in vain, Megumi triggers the Ten Shadows Technique's ultimate, untamable trump card: the <strong>Eight-Handled Sword Divergent Sila Divine General Mahoraga</strong>.</p>

    <div class="manga-panel-figure">
      <img src="https://cdn.myanimelist.net/images/manga/3/243675.jpg" alt="Jujutsu Kaisen Manga Panel Art" class="manga-panel-img" />
      <div class="manga-panel-caption">
        <span><strong>Jujutsu Kaisen</strong> — Gege Akutami (Shueisha / Weekly Shonen Jump)</span>
        <span>Chapter 117: Shibuya Incident Arc</span>
      </div>
    </div>

    <p>Gege Akutami's composition in Chapter 117 and the subsequent clash with Ryomen Sukuna in Chapter 118 is a masterclass in kinetic tension. The looming dharma wheel hovering behind Mahoraga, the eight-winged crown, and the relentless, heavy brushstrokes give the shikigami an otherworldly, mythological terror.</p>
    
    <p>When Sukuna counters with <em>Malevolent Shrine</em> and his fire arrow <em>Fuga</em>, the two-page destruction spreads solidified Shibuya as one of the peak battle arcs in modern manga.</p>

    <h2>2. One Piece — The Drums of Liberation (Gear 5 & Joyboy Awaken)</h2>

    <div class="manga-quote">
      "Listen closely... the Drums of Liberation! After 800 years... Joyboy has returned!" — Zunesha (Chapter 1044)
    </div>

    <p>For over 25 years and 1,000 chapters, fans speculated on Monkey D. Luffy's ultimate form. When Kaido struck down Luffy atop Onigashima, Oda answered with one of the most daring visual choices in manga history: pure, unadulterated cartoon freedom.</p>

    <div class="manga-panel-figure">
      <img src="https://cdn.myanimelist.net/images/manga/2/253146.jpg" alt="One Piece Gear 5 Joyboy Manga Art" class="manga-panel-img" />
      <div class="manga-panel-caption">
        <span><strong>One Piece</strong> — Eiichiro Oda (Shueisha / Weekly Shonen Jump)</span>
        <span>Chapter 1044: Warrior of Liberation</span>
      </div>
    </div>

    <p>The iconic silhouette of Luffy laughing uncontrollably in front of a giant full moon—his hair turned into fiery white clouds, heart beating to the rhythm of liberation—shattered conventional shonen powerup tropes. Instead of darker, edgier rage, Luffy embodied the pure joy of limitless imagination.</p>

    <h2>3. Chainsaw Man — The Darkness Devil Astronaut Procession</h2>

    <div class="manga-quote">
      "The Primal Fears have never once experienced death in Hell." — Makima (Chapter 64)
    </div>

    <p>When Denji and Public Safety are dragged into Hell during the International Assassins Arc, Tatsuki Fujimoto delivered what is arguably the most surreal horror spread in modern Jump history: eleven bisected NASA astronauts lining a path, their palms pressed together in prayer towards the darkness.</p>

    <div class="manga-panel-figure">
      <img src="https://cdn.myanimelist.net/images/manga/3/216464.jpg" alt="Chainsaw Man Darkness Devil Spread" class="manga-panel-img" />
      <div class="manga-panel-caption">
        <span><strong>Chainsaw Man</strong> — Tatsuki Fujimoto (Shueisha / Shonen Jump+)</span>
        <span>Chapter 64: Welcome to Hell</span>
      </div>
    </div>

    <p>Fujimoto strips away traditional speed lines and action effects, replacing them with absolute, terrifying stillness. The astronaut motif represents mankind's greatest reach into the unknown—and how utterly small humanity is before the primal fear of the dark.</p>

    <h2>4. Bleach: Thousand-Year Blood War — The Fury of Zanka no Tachi</h2>

    <p>Tite Kubo's mastery of stark black ink, extreme contrast, and negative space reaches its zenith in the Thousand-Year Blood War arc. When Head Captain Shigekuni Yamamoto unleashes his Bankai, <em>Zanka no Tachi (Longsword of the Remnant Flame)</em>, all moisture in Soul Society evaporates.</p>

    <p>Kubo's spread of Yamamoto walking forward wrapped in 15,000,000-degree invisible heat—standing over the charred skeletons of his fallen enemies (<em>Zanka no Tachi, Minami: Kaka Jūman'okushi Daisōjin</em>)—stands as a monument of pure artistic intimidation.</p>

    <h2>5. Berserk — The Weight of the Berserker Armor</h2>

    <div class="manga-panel-figure">
      <img src="https://cdn.myanimelist.net/images/manga/1/157897.jpg" alt="Berserk Kentaro Miura Masterpiece Ink Work" class="manga-panel-img" />
      <div class="manga-panel-caption">
        <span><strong>Berserk</strong> — Kentaro Miura (Hakusensha / Young Animal)</span>
        <span>Chapter 225: The Berserker Armor</span>
      </div>
    </div>

    <p>No discussion of manga paneling is complete without the late master <strong>Kentaro Miura</strong>. His intricate cross-hatching, monstrous anatomy, and sprawling panoramic battlefields in <em>Berserk</em> remain the gold standard of dark fantasy ink work.</p>

    <p>When the Berserker Armor forcefully pierces Guts' bones back into place while he carves through legions of Apostles, Miura captures the terrifying cost of sheer willpower against inescapable destiny.</p>

    <h2>Summary: Why Manga Panels Endure</h2>
    <p>While anime adaptations bring color, motion, and voice acting, the raw power of the original manga panel remains unmatched. A solitary author, armed with nothing but black ink and a pen nib, creates a universe that burns into the memory of millions across the globe.</p>
  `,
  category: "review",
  coverImage: "https://cdn.myanimelist.net/images/manga/3/243675.jpg",
  coverColor: "#E8643A",
  author: "Ghibli Gazette Editorial",
  published: true,
  date: "2026-08-20",
  tags: ["Manga", "Manga Panels", "JJK", "Mahoraga", "One Piece", "Gear 5", "Chainsaw Man", "Bleach", "Berserk"],
  views: 142
}

async function run() {
  try {
    const raw = await redis.get<Post[]>("posts")
    let posts = raw || []

    // Check if article already exists
    const existingIndex = posts.findIndex((p) => p.id === mangaArticle.id)
    if (existingIndex >= 0) {
      posts[existingIndex] = mangaArticle
      console.log("Updated existing manga panel article!")
    } else {
      posts = [mangaArticle, ...posts]
      console.log("Added new manga panel article to top!")
    }

    await redis.set("posts", posts)
    console.log(`Successfully saved ${posts.length} posts to Redis.`)
  } catch (err) {
    console.error("Error inserting manga panel article:", err)
  }
}

run()
