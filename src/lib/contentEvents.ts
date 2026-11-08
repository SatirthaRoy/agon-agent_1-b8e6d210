export type ContentSection = 'timeline' | 'reasons' | 'gallery' | 'notes' | 'bucketlist' | 'quiz' | 'lovejar';

const CONTENT_UPDATED_EVENT = 'love-story-content-updated';

export function notifyContentUpdated(section: ContentSection) {
  window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT, { detail: { section } }));
}

export function subscribeToContentUpdates(section: ContentSection, callback: () => void) {
  const handleUpdate = (event: Event) => {
    const updatedSection = (event as CustomEvent<{ section?: ContentSection }>).detail?.section;
    if (updatedSection === section) callback();
  };

  window.addEventListener(CONTENT_UPDATED_EVENT, handleUpdate);
  return () => window.removeEventListener(CONTENT_UPDATED_EVENT, handleUpdate);
}
