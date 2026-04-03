export interface VimeoMediaResponse {
  videoUrl: string | null;
  thumbnailUrl: string | null;
}

export async function getVimeoMedia(
  videoId: string,
  enableHls: boolean = true, // Added parameter with default true for backward compatibility
): Promise<VimeoMediaResponse> {
  const token = process.env.NEXT_PUBLIC_VIMEO_PERSONAL_ACCESS_TOKEN!;

  // Initialize response object
  const response: VimeoMediaResponse = {
    videoUrl: null,
    thumbnailUrl: null,
  };

  const res = await fetch(`https://api.vimeo.com/videos/${videoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error(`Failed to fetch Vimeo video ${videoId}`, await res.text());
    return response;
  }

  const data = await res.json();

  // Process thumbnail URL
  if (data?.pictures?.sizes && data.pictures.sizes.length > 0) {
    const sizes = data.pictures.sizes;

    // Get the base URL and any existing query parameters
    const [baseUrl, queryString] = sizes[0].link.split("?");

    // Parse existing query parameters into an object
    const params = new URLSearchParams(queryString || "");

    // Remove existing 'r' parameter if it exists
    params.delete("r");

    // Set to 'fit' resize option and quality
    params.set("r", "fit");
    params.set("q", "85");

    // Set the thumbnail URL with the updated parameters
    response.thumbnailUrl = `${baseUrl}?${params.toString()}`;
  }

  // If enableHls is false, skip HLS priorities and go straight to progressive MP4
  if (!enableHls) {
    // Get 1080p progressive MP4 URL
    if (data.play?.progressive && data.play.progressive.length > 0) {
      // Find 1080p video or closest resolution
      let progressiveFiles = [...data.play.progressive];

      // Try to find 1080p first
      const video1080p = progressiveFiles.find((file) => file.height === 1080);
      if (video1080p) {
        response.videoUrl = video1080p.url || null;
        return response;
      }

      // Otherwise sort by resolution (highest first) and pick the best available
      progressiveFiles = progressiveFiles.sort((a, b) => b.height - a.height);
      response.videoUrl = progressiveFiles[0]?.url || null;
      return response;
    }
  }

  // Process video URL with HLS priority if enableHls is true
  // Priority 1: HLS from play object
  if (enableHls && data.play?.hls?.link) {
    response.videoUrl = data.play.hls.link;
    return response;
  }

  // Priority 2: Check for HLS in files array
  if (enableHls && data.files) {
    const hlsFile = data.files.find((file: any) => file.quality === "hls");
    if (hlsFile?.link) {
      response.videoUrl = hlsFile.link;
      return response;
    }
  }

  // Priority 3: Progressive MP4 as fallback
  if (data.play?.progressive && data.play.progressive.length > 0) {
    const progressiveFiles = [...data.play.progressive].sort(
      (a, b) => b.width - a.width,
    );
    response.videoUrl = progressiveFiles[0]?.url || null;
    return response;
  }

  // Priority 4: Any other video file from files array
  if (data.files && data.files.length > 0) {
    const videoFiles = data.files
      .filter((file: any) => file.type?.startsWith("video/"))
      .sort((a: any, b: any) =>
        a.height && b.height ? b.height - a.height : 0,
      );

    if (videoFiles.length > 0) {
      response.videoUrl = videoFiles[0].link;
      return response;
    }
  }

  // Priority 5: Download links
  if (data.download && data.download.length > 0) {
    const downloads = [...data.download].sort((a, b) => b.width - a.width);
    response.videoUrl = downloads[0]?.link || null;
  }

  return response;
}
