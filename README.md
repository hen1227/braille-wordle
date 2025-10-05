
# Braille Wordle
A ReactJS website that introduces a Braille version of the popular game Wordle. The game is designed to help users learn and practice Braille characters in an engaging way.

Braille Wordle is part of the [BrailleDecoded app](https://brailledecoded.com), an initiative to make learning Braille more accessible through interactive web tools and games.  

Live Demo at [wordle.brailledecoded.com](https://wordle.brailledecoded.com)



## Goal Features
- [X] Interactive Braille Wordle game
  - Fun without prior knowledge of Braille
  - Is challenging yet fair; doesn't have a perfect strategy.
- [X] Responsive design for various devices
- [X] Accessibility features for visually impaired users
- [X] Score tracking and statistics
- [ ] ~~UEB Contracted braille mode??~~

## Tech Stack
- **Frontend:** React + TypeScript + Vite
- **Routing:** React Router
- **Styling:** CSS with responsive layout
- **Deployment:** Cloudflare Workers (static + SPA fallback)


## Development
Clone the repository and install dependencies:

```bash
git clone https://github.com/hen1227/braille-wordle.git
cd braille-wordle
npm install
npm run dev
```

## Contributing
Contributions are welcome!  
If you’d like to improve the Braille logic, add new accessibility features, or enhance UI/UX:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Submit a pull request


## Authors
- [Henry Abrahamsen](https://github.com/hen1227)
- [Eli Beber](https://github.com/Trate318)

## License
This project is licensed under the  
**[Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/)**.


## Related Projects
- [Braille Decoded](https://brailledecoded.com) — iOS, Android and Web App for learning Contracted UEB Braille
- [native-libLouis](https://github.com/hen1227/native-liblouis) — React Native Braille translation library
