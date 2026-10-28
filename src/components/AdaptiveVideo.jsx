import { forwardRef } from 'react';

/**
 * AdaptiveVideo
 *
 * A drop-in replacement for <video> that transparently handles:
 *  - Regular MP4 / Cloudinary URLs
 *  - Bunny Stream .mp4 play URLs
 *
 * Accepts all standard <video> props plus a `src` string.
 * Supports forwardRef for external playback control (e.g. videoRef.current.play()).
 */
const AdaptiveVideo = forwardRef(function AdaptiveVideo({ src, ...props }, ref) {
  if (!src) {
    return <div ref={ref} style={{ background: '#111' }} {...props} />;
  }

  return (
    <video
      ref={ref}
      src={src}
      {...props}
    />
  );
});

export default AdaptiveVideo;
