import Lottie from "lottie-react";
import chatAnimation from "../../public/chatbot.json"

/**
 * Animated Chat Button Component with Lottie
 * 
 * This component replaces the static MessageCircle icon with a Lottie animation
 * You can use any chat-related Lottie animation JSON file
 */

interface AnimatedChatButtonProps {
  onClick: () => void;
  animationData?: object; // Optional: Pass your own Lottie JSON
  animationUrl?: string;  // Optional: URL to Lottie JSON file
  size?: number;
  className?: string;
}

export const AnimatedChatButton: React.FC<AnimatedChatButtonProps> = ({
  onClick,
  animationData,
  animationUrl = 'https://assets5.lottiefiles.com/packages/lf20_rrhjmw5m.json', // Default chat animation
  size = 40,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load Lottie animation
    if (animationData) {
      // Use provided animation data
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData,
      });
    } else if (animationUrl) {
      // Load from URL
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: animationUrl,
      });
    }

    // Cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [animationData, animationUrl]);

  return (
    <button
      onClick={onClick}
      className={`w-16 h-16 bg-purple-600 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center group relative overflow-hidden ${className}`}
      aria-label="Open chat"
    >
      {/* Animated background pulse */}
      <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping opacity-20" />
      
      {/* Lottie animation container */}
      <div
        ref={containerRef}
        style={{ width: size, height: size }}
        className="relative z-10"
      />
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
    </button>
  );
};

export default AnimatedChatButton;