# Blog Admin Panel

The **Blog Admin Panel** is a Next.js-based dashboard for administrators to manage users, posts, comments, tags and system settings.

## 🚀 Features

- **Post Moderation** (Create, Edit, delete posts)
- **Comment Moderation** (Edit, Delete comment)
- **Tag Management** (Edit, Delete comment)
- **User Profile Update**
- **Role-based Access Control**

## 🛠 Tech Stack

- **Next.js**
- **ShadCN/UI & Tailwind CSS**
- **Axios** (API calls)

## 🖼 Screenshots

Here are some screenshots of the admin panel:

![Post Management](/assets/posts.png)
![Create Post](/assets/new-post.png)
![Profile](/assets/profile.png)

## 📦 Installation

```sh
git clone https://github.com/nguyenhoanganh1808/my-blog-admin.git
cd my-blog-admin
pnpm install
```

## ⚙️ Configuration

Create a `.env.local` file:

```env
NEXT_PUBLIC_TINYMCE_API_KEY=your_tinymce_api_key
NEXT_PUBLIC_API_URL=your_api_endpoint
```

## ▶️ Running the Admin Panel

```sh
pnpm dev
```

## 🚀 Deployment on Vercel

```sh
vercel deploy
```

## 🔗 Related Projects

- **Blog API Backend**: [GitHub Repository](https://github.com/nguyenhoanganh1808/blog-post-apis)
- **Blog Frontend**: [GitHub Repository](https://github.com/nguyenhoanganh1808/my-blog-frontend)
