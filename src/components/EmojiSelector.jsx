import PropTypes from 'prop-types';

function EmojiSelector({ label, description, emojis, selectedEmoji, onSelect }) {
  return (
    <div className="emoji-selector">
      <div className="selector-text">
        <p className="selector-label">{label}</p>
        <p className="selector-description">{description}</p>
      </div>
      <div className="emoji-grid" role="listbox" aria-label={label}>
        {emojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className={`emoji-button${selectedEmoji === emoji ? ' selected' : ''}`}
            onClick={() => onSelect(emoji)}
            aria-pressed={selectedEmoji === emoji}
            aria-label={`Choisir ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

EmojiSelector.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  emojis: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedEmoji: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

EmojiSelector.defaultProps = {
  selectedEmoji: '',
};

export default EmojiSelector;
