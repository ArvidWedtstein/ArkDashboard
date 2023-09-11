import { render, screen, fireEvent } from '@redwoodjs/testing/web'
import React from 'react';

import { MultiSelectLookup } from './Lookup'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

const mockOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  // Add more mock options as needed
];

describe('MultiSelectLookup Component', () => {
  it('renders with placeholder when no options are selected', () => {
    render(
      <MultiSelectLookup
        options={mockOptions}
        placeholder="Select options"
      />
    );

    const placeholderElement = screen.getByText('Select options');
    expect(placeholderElement).toBeInTheDocument();
  });

  it('displays selected options', () => {
    render(
      <MultiSelectLookup
        options={mockOptions}
        defaultValue={mockOptions.slice(0, 2).map(o => o.value)} // Simulate two selected options
      />
    );

    const selectedOption1 = screen.getByText('Option 1');
    const selectedOption2 = screen.getByText('Option 2');

    expect(selectedOption1).toBeInTheDocument();
    expect(selectedOption2).toBeInTheDocument();
  });

  it('invokes onSelect callback when an option is selected', () => {
    const onSelectMock = jest.fn();

    render(
      <MultiSelectLookup
        options={mockOptions}
        onSelect={onSelectMock}
      />
    );

    const optionToSelect = screen.getByText('Option 1');

    fireEvent.click(optionToSelect);

    // Ensure that onSelectMock was called with the selected option
    expect(onSelectMock).toHaveBeenCalledWith([mockOptions[0]]);
  });

  it('clears selected options when "Clear Selection" is clicked', () => {
    const onSelectMock = jest.fn();

    render(
      <MultiSelectLookup
        options={mockOptions}
        defaultValue={mockOptions.slice(0, 2).map(o => o.value)}
        onSelect={onSelectMock}
      />
    );

    const clearSelectionButton = screen.getByText('Clear Selection');

    fireEvent.click(clearSelectionButton);

    // Ensure that onSelectMock was called with an empty array
    expect(onSelectMock).toHaveBeenCalledWith([]);
  });
});