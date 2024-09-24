// Adapted from https://flowbite.com/docs/components/accordion/

import { useState } from "react";
import PropTypes from "prop-types";

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="accordion" id="accordion-open">
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          <h2>
            <button
              type="button"
              className={`flex items-center justify-between w-full p-5 font-semibold text-secondary font-montserrat border border-bgsecondary rounded-t-xl focus:ring-4 focus:ring-bgsecondary dark:focus:ring-secondary dark:border-elemsec gap-2 ${
                openIndex === index ? "rounded-b-none" : ""
              }`}
              onClick={() => handleToggle(index)}
              aria-expanded={openIndex === index}
            >
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 me-2 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">{item.title}</span>
              </span>
              <svg
                className={`w-3 h-3 transform ${
                  openIndex === index ? "rotate-0" : "rotate-180"
                } shrink-0`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
                aria-hidden="true"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>
          </h2>
          {openIndex === index && (
            <div className="p-5 border border-bgsecondary dark:border-secondary bg-bgsecondary">
              <div className="text-secondary font-montserrat">
                {item.content}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

Accordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
        .isRequired,
    })
  ).isRequired,
};

export default Accordion;
