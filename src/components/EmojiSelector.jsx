import PropTypes from 'prop-types';
import Lottie from 'lottie-react';

function EmojiSelector({ label, description, options, selectedValue, onSelect }) {
  return (
    <div className="emoji-selector">
      <div className="selector-text">
        <p className="selector-label">{label}</p>
        <p className="selector-description">{description}</p>
      </div>
      <div className="emoji-grid" role="listbox" aria-label={label}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={option.id}
              type="button"
              className={`emoji-button${isSelected ? ' selected' : ''}`}
              onClick={() => onSelect(option.value)}
              aria-pressed={isSelected}
              aria-label={`Choisir ${option.label}`}
            >
              <Lottie className="selector-lottie" animationData={option.animationData} loop autoplay />
              <span className="emoji-button-label">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

EmojiSelector.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      animationData: PropTypes.object.isRequired,
    })
  ).isRequired,
  selectedValue: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

EmojiSelector.defaultProps = {
  selectedValue: '',
};

export default EmojiSelector;
