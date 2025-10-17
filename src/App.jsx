
import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [videoUrl] = useState('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4')
  const [comments, setComments] = useState([])
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [hoveredComment, setHoveredComment] = useState(null)
  const videoRef = useRef(null)

  const handleAddComment = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setCurrentTime(videoRef.current.currentTime)
      setShowCommentModal(true)
    }
  }

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment,
        timestamp: currentTime,
        timeString: formatTime(currentTime)
      }
      setComments([...comments, comment].sort((a, b) => a.timestamp - b.timestamp))
      setNewComment('')
      setShowCommentModal(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCommentClick = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration)
    }
  }

  const handleTimelineDotClick = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp
    }
  }

  const handleDotMouseEnter = (comment) => {
    setHoveredComment(comment)
  }

  const handleDotMouseLeave = () => {
    setHoveredComment(null)
  }

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Prevent fullscreen on mobile devices
      video.addEventListener('webkitfullscreenchange', (e) => {
        if (document.webkitFullscreenElement) {
          document.webkitExitFullscreen()
        }
      })
      
      video.addEventListener('fullscreenchange', (e) => {
        if (document.fullscreenElement) {
          document.exitFullscreen()
        }
      })

      // Prevent context menu on long press
      video.addEventListener('contextmenu', (e) => {
        e.preventDefault()
      })
    }
  }, [])

  return (
    <div className="app">
      <div className="header">
        <h1>Video Comment System</h1>
      </div>

      <div className="main-content">
        <div className="video-section">
          <div className="video-container">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="video-player"
              playsInline
              webkit-playsinline="true"
              x5-playsinline="true"
              x5-video-player-type="h5"
              x5-video-player-fullscreen="false"
            >
              Your browser does not support the video tag.
            </video>
            {videoDuration > 0 && (
              <div className="timeline-overlay">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="timeline-dot"
                    style={{
                      left: `${(comment.timestamp / videoDuration) * 100}%`
                    }}
                    onClick={() => handleTimelineDotClick(comment.timestamp)}
                    onMouseEnter={() => handleDotMouseEnter(comment)}
                    onMouseLeave={handleDotMouseLeave}
                    title={`Comment at ${comment.timeString}`}
                  />
                ))}
                {hoveredComment && (
                  <div 
                    className="comment-tooltip"
                    style={{
                      left: `${(hoveredComment.timestamp / videoDuration) * 100}%`
                    }}
                  >
                    <div className="tooltip-time">{hoveredComment.timeString}</div>
                    <div className="tooltip-text">{hoveredComment.text}</div>
                  </div>
                )}
              </div>
            )}
            <button 
              className="comment-btn"
              onClick={handleAddComment}
              title="Add comment at current time"
            >
              💬 Add Comment
            </button>
          </div>
        </div>

        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>
          <div className="comments-list">
            {comments.map((comment) => (
              <div 
                key={comment.id} 
                className="comment-item"
                onClick={() => handleCommentClick(comment.timestamp)}
              >
                <div className="comment-time">{comment.timeString}</div>
                <div className="comment-text">{comment.text}</div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="no-comments">No comments yet. Click "Add Comment" to add your first comment!</p>
            )}
          </div>
        </div>
      </div>

      {showCommentModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Comment at {formatTime(currentTime)}</h3>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Enter your comment..."
              className="comment-textarea"
              autoFocus
            />
            <div className="modal-buttons">
              <button 
                onClick={() => setShowCommentModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitComment}
                className="submit-btn"
                disabled={!newComment.trim()}
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
