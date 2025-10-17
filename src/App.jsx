
import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [videoUrl] = useState('https://my-video-platform-storage.s3.ap-south-1.amazonaws.com/SSYouTube.online_Zindagi+Tere+Naam+Video+Song+4k+60fps+-+Yodha_1080p.mp4')
  const [comments, setComments] = useState([])
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [hoveredComment, setHoveredComment] = useState(null)
  const [videoContainerWidth, setVideoContainerWidth] = useState(0)
  const [videoBounds, setVideoBounds] = useState({ left: 0, width: 0 })
  const [showCurrentTimeIndicator, setShowCurrentTimeIndicator] = useState(false)
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  const handleAddComment = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      // Capture the exact current time with high precision
      const exactTime = videoRef.current.currentTime
      setCurrentTime(exactTime)
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
    const milliseconds = Math.floor((seconds % 1) * 1000)
    return `${mins}:${secs.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
  }

  const handleCommentClick = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      // Capture time with high precision
      const preciseTime = videoRef.current.currentTime
      setCurrentTime(preciseTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration)
      // Update video bounds when video loads
      setTimeout(() => {
        updateVideoBounds()
      }, 100)
    }
  }

  const handleTimelineDotClick = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp
    }
  }

  const handleTimelineDotTouch = (e, timestamp) => {
    e.preventDefault()
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp
    }
  }

  const getExactTimeFromClick = (e) => {
    if (!videoRef.current || !containerRef.current || videoDuration === 0 || videoBounds.width === 0) return 0
    
    const containerRect = containerRef.current.getBoundingClientRect()
    const clickX = e.clientX - containerRect.left
    
    // Calculate position relative to video area (timeline overlay now matches video exactly)
    const relativeX = clickX - videoBounds.left
    const percentage = Math.max(0, Math.min(1, relativeX / videoBounds.width))
    const exactTime = percentage * videoDuration
    
    // Return time with millisecond precision
    return Math.max(0, Math.min(videoDuration, parseFloat(exactTime.toFixed(6))))
  }

  const handleDotMouseEnter = (comment) => {
    setHoveredComment(comment)
  }

  const handleDotMouseLeave = () => {
    setHoveredComment(null)
  }

  const handleTimelineClick = (e) => {
    if (videoRef.current && videoDuration > 0) {
      const exactTime = getExactTimeFromClick(e)
      videoRef.current.currentTime = exactTime
      setCurrentTime(exactTime)
    }
  }

  const handleTimelineMouseMove = (e) => {
    if (videoDuration > 0) {
      setShowCurrentTimeIndicator(true)
      const exactTime = getExactTimeFromClick(e)
      setCurrentTime(exactTime)
    }
  }

  const handleTimelineMouseLeave = () => {
    setShowCurrentTimeIndicator(false)
  }

  const calculateTimelinePosition = (timestamp) => {
    if (!videoRef.current || videoDuration === 0 || videoBounds.width === 0) return 0
    
    // Ensure we have a valid timestamp with high precision
    const validTimestamp = Math.max(0, Math.min(timestamp, videoDuration))
    
    // Calculate percentage position relative to video area
    // Since timeline overlay now matches video exactly, we can use simple percentage
    const percentage = (validTimestamp / videoDuration) * 100
    
    // Return with high precision (6 decimal places)
    return Math.max(0, Math.min(100, parseFloat(percentage.toFixed(6))))
  }

  const updateVideoContainerWidth = () => {
    if (containerRef.current) {
      setVideoContainerWidth(containerRef.current.offsetWidth)
    }
  }

  const updateVideoBounds = () => {
    if (videoRef.current && containerRef.current) {
      const video = videoRef.current
      const container = containerRef.current
      
      const containerRect = container.getBoundingClientRect()
      const videoRect = video.getBoundingClientRect()
      
      // Calculate video position relative to container
      const videoLeft = videoRect.left - containerRect.left
      const videoWidth = videoRect.width
      
      setVideoBounds({ left: videoLeft, width: videoWidth })
      
      // Debug logging
      console.log('Video bounds updated:', {
        containerWidth: containerRect.width,
        videoLeft: videoLeft,
        videoWidth: videoWidth,
        videoLeftPercent: (videoLeft / containerRect.width) * 100,
        videoWidthPercent: (videoWidth / containerRect.width) * 100
      })
    }
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

  useEffect(() => {
    // Update container width and video bounds on mount and resize
    updateVideoContainerWidth()
    updateVideoBounds()
    
    const handleResize = () => {
      updateVideoContainerWidth()
      updateVideoBounds()
    }

    window.addEventListener('resize', handleResize)
    
    // Use ResizeObserver for more accurate container size changes
    let resizeObserver
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateVideoContainerWidth()
        updateVideoBounds()
      })
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [])

  return (
    <div className="app">
      <div className="header">
        <h1>Video Comment System</h1>
      </div>

      <div className="main-content">
        <div className="video-section">
          <div className="video-container" ref={containerRef}>
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
            {videoDuration > 0 && videoBounds.width > 0 && (
              <div 
                className="timeline-overlay" 
                key={`timeline-${videoContainerWidth}-${videoBounds.left}-${videoBounds.width}`}
                style={{
                  left: `${videoBounds.left}px`,
                  width: `${videoBounds.width}px`
                }}
                onClick={handleTimelineClick}
                onMouseMove={handleTimelineMouseMove}
                onMouseLeave={handleTimelineMouseLeave}
              >
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="timeline-dot"
                    style={{
                      left: `${calculateTimelinePosition(comment.timestamp)}%`
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTimelineDotClick(comment.timestamp)
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation()
                      handleTimelineDotTouch(e, comment.timestamp)
                    }}
                    onMouseEnter={() => handleDotMouseEnter(comment)}
                    onMouseLeave={handleDotMouseLeave}
                    title={`Comment at ${comment.timeString}`}
                  />
                ))}
                {showCurrentTimeIndicator && (
                  <div 
                    className="current-time-indicator"
                    style={{
                      left: `${calculateTimelinePosition(currentTime)}%`
                    }}
                  >
                    <div className="indicator-line"></div>
                    <div className="indicator-time">{formatTime(currentTime)}</div>
                  </div>
                )}
                {hoveredComment && (
                  <div 
                    className="comment-tooltip"
                    style={{
                      left: `${calculateTimelinePosition(hoveredComment.timestamp)}%`
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
