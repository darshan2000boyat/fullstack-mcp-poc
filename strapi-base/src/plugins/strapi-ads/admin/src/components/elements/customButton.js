import styled from 'styled-components';

const CustomButton = styled.button.attrs((props) => ({
  type: props.type || 'button', // default to 'button' if not specified
}))`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.neutral100}; /* Use Strapi theme color */
  border: 1px solid ${({ theme }) => theme.colors.neutral200}; /* Use theme border color */
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral800}; /* Use theme text color */
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral200}; /* Hover background color */
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: auto;
    height: 1rem;
    path {
      fill: none;
    }
  }
`;

export default CustomButton;
