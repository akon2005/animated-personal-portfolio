import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");

  const handleMouseEnter = async () => {
    if (!props.video) return;
    setIsVideo(true);
    try {
      const response = await fetch(`src/assets/${props.video}`);
      const blob = await response.blob();
      setVideo(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Failed to load the project preview video:", error);
      setIsVideo(false);
    }
  };

  const handleMouseLeave = () => setIsVideo(false);

  const content = (
    <>
      {props.link && (
        <div className="work-link">
          <MdArrowOutward />
        </div>
      )}
      <img src={props.image} alt={props.alt} />
      {isVideo && video && (
        <video src={video} autoPlay muted playsInline loop></video>
      )}
    </>
  );

  return (
    <div className="work-image">
      {props.link ? (
        <a
          className="work-image-in"
          href={props.link}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="disable"
          aria-label={`Open ${props.alt ?? "project"} in a new tab`}
        >
          {content}
        </a>
      ) : (
        // Projects without a public URL are not links - previously this rendered
        // an anchor with no href, which looks interactive but does nothing.
        <div className="work-image-in">{content}</div>
      )}
    </div>
  );
};

export default WorkImage;
