// Shared project-image resolver — used by ProjectSection.vue (list/featured
// thumbnails) and ProjectItem.vue (case-study dialog carousel) so both fall
// back to the same placeholder when a sheet-referenced image is missing.
function resolveProjectImage(imgSrc) {
  try {
    return require(`@/assets/project-images/${imgSrc}`);
  } catch (err) {
    return require('@/assets/no-image-2.jpg');
  }
}

module.exports = { resolveProjectImage };
