# ⚡ Quick Start Guide

Get SimplePlay running in 3 easy steps!

## 🎯 Step 1: Open the Site

Simply open `index.html` in your web browser. That's it!

**Double-click** `index.html` or **right-click** → Open with → Your browser

## 🎮 Step 2: Start Playing

- Browse games from the home page
- Click any game to start playing instantly
- Your scores are saved automatically

## 🌐 Step 3: Deploy (Optional)

Want to share with others?

### Easiest Method: Netlify Drag & Drop
1. Go to [netlify.com](https://netlify.com)
2. Drag the entire `paperongames` folder
3. Done! You get a free URL

### Alternative: GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git push to GitHub
Enable GitHub Pages in settings
```

## 📝 Quick Customization

### Change Colors
Edit `assets/css/main.css`:
```css
:root {
  --primary: #2B2D42;    /* Dark blue */
  --accent: #EF233C;     /* Red */
  --background: #EDF2F4; /* Light gray */
}
```

### Update Site Name
Search and replace "SimplePlay" with your name in:
- `index.html`
- `games.html`
- `chat.html`
- `about.html`

### Add Your Domain
Replace `yourdomain.netlify.app` in:
- `meta/sitemap.xml`
- `meta/robots.txt`
- `index.html` (structured data)

## 🎨 Optional Enhancements

1. **Add Icons**: Place logo files in `assets/`
2. **Custom Favicon**: Add `favicon.ico` to root
3. **Analytics**: Add tracking code to all HTML files

## 🆘 Troubleshooting

**Games not working?**
- Make sure all folders are in place
- Check browser console (F12) for errors

**Styles look wrong?**
- Clear browser cache (Ctrl+F5)
- Check file paths in HTML

**Chat not saving?**
- Check if localStorage is enabled in browser
- Try in incognito mode to test

## 📚 More Help

- Read `README.md` for full documentation
- Check `DEPLOYMENT.md` for hosting guides
- All games are in `/games/` folder

## 🎉 That's It!

You now have a fully functional gaming website. Enjoy! 🎮

---

**Need more help?** Check the full documentation in README.md
