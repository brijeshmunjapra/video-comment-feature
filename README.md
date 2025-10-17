# Video Comment System

A React-based video player with interactive comment functionality that allows users to add comments at specific timestamps in videos.

## Features

- **Interactive Video Player**: Play videos with standard HTML5 video controls
- **Timestamp Comments**: Add comments at any point in the video timeline
- **Visual Timeline Indicators**: See comment markers on the video timeline
- **Clickable Comments**: Click on comments to jump to that timestamp
- **Comment Tooltips**: Hover over timeline dots to preview comments
- **Responsive Design**: Works on desktop and mobile devices
- **Precise Timing**: Comments are placed with millisecond precision

## How It Works

1. **Add Comment**: Click the "💬 Add Comment" button while the video is playing
2. **Timeline Navigation**: Click anywhere on the timeline to jump to that timestamp
3. **Comment Interaction**: Click on comment items in the sidebar to jump to that moment
4. **Visual Feedback**: Timeline dots show where comments are placed
5. **Hover Preview**: Hover over timeline dots to see comment previews

## Technical Features

- Built with React 19 and Vite
- High-precision timestamp calculation
- Responsive video container with ResizeObserver
- Touch-friendly mobile interactions
- Prevents fullscreen on mobile devices
- Context menu prevention for better UX

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/brijeshmunjapra/video-comment-feature.git
cd video-comment-feature
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the local development URL (usually `http://localhost:5173`)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── App.jsx          # Main application component
├── App.css          # Application styles
├── main.jsx         # Application entry point
└── index.css        # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
