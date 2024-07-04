import React from 'react';

const InjectScriptButton = () => {
  const scriptContent = `
    (function() {
      // Create a dropdown
      const dropdown = document.createElement('select');
      dropdown.id = 'languageDropdown';
      dropdown.className = 'fixed bottom-5 left-5 p-2 border border-gray-300 rounded bg-white shadow-lg';
      
      // Add options to the dropdown
      const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];
      languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = lang;
        dropdown.appendChild(option);
      });

      // Append the dropdown to the body
      document.body.appendChild(dropdown);
    })();
  `;

  const handleButtonClick = () => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.textContent = scriptContent;
    document.head.appendChild(script);
  };

  return (
    <button onClick={handleButtonClick} className="p-3 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-700">
      Inject Language Dropdown
    </button>
  );
};

export default InjectScriptButton;
