export const validateStories = (stories) => {
  if (!Array.isArray(stories)) return [];
  return stories.filter(story => story && Array.isArray(story.slides) && story.slides.length > 0);
};

export const getCurrentStory = (stories, storyIndex) => {
  if (!stories[storyIndex]) return null;
  return stories[storyIndex];
};

export const getCurrentSlide = (story, slideIndex) => {
  if (!story?.slides || !story.slides[slideIndex]) return null;
  return story.slides[slideIndex];
};

export const getNextSlideIndex = (currentIndex, slidesLength) => {
  return currentIndex + 1 < slidesLength ? currentIndex + 1 : 0;
};

export const getNextStoryIndex = (currentIndex, storiesLength) => {
  return currentIndex + 1 < storiesLength ? currentIndex + 1 : currentIndex;
};

export const getPreviousSlideIndex = (currentIndex) => {
  return Math.max(0, currentIndex - 1);
};

export const getPreviousStoryIndex = (currentIndex) => {
  return Math.max(0, currentIndex - 1);
};

export const shouldCloseViewer = (storyIndex, storiesLength) => {
  return storyIndex >= storiesLength - 1;
};

export const getSafeImageUri = (slide) => {
  if (!slide) return null;
  return slide.uri || slide.image || slide.url;
};

export const getSafeCaption = (slide) => {
  if (!slide) return '';
  return slide.caption || slide.text || '';
};
