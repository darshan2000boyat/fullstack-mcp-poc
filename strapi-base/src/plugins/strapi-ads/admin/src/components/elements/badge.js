// @ts-nocheck
import styled from 'styled-components';

const Badge = styled.span`
  display: inline-block;
  width: fit-content;
  padding: 4px 6px;
  font-size: 10px;
  font-weight: 400;
  border-radius: 20px;
  text-transform: Capitalize;
  white-space: nowrap;
  background: ${({ variant }) =>
    variant === 'active' || variant === 'live'
      ? '#eafbe7'
      : variant === 'inactive'
        ? '#fdf4dc'
        : variant === 'draft'
          ? '#f6f6f9'
          : ''};
  border: ${({ variant }) =>
    variant === 'grayOutline'
      ? '2px solid #eaeaea'
      : variant === 'active' || variant === 'live'
        ? '2px solid #eafbe7'
        : variant === 'inactive'
          ? '2px solid #fdf4dc'
          : variant === 'draft'
            ? '2px solid #f6f6f9'
            : ''};
  color: ${({ variant }) =>
    variant === 'active' || variant === 'live'
      ? '#5cb176'
      : variant === 'inactive'
        ? '#f29d41'
        : variant === 'draft' || variant === 'grayOutline'
          ? '#8e8ea9'
          : ''};
`;

export default Badge;
