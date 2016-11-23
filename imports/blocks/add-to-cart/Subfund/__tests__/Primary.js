
import { mount } from "enzyme";
import { mountToJson } from "enzyme-to-json";
import { reset, startBuffering } from "aphrodite/lib/inject";
import { getSingleSpecWrapper } from "../../../../util/tests/data-spec.js";

import Primary from "../Primary";

const generateComponent = (additionalProps={}) => {
  const defaultProps = {
    state: {
      id: "test",
      fund: "main",
    },
    preFill: () => {},
    accounts: [{value: "main fund"}],
  };

  return <Primary {...defaultProps} {...additionalProps} />
};

beforeEach(() => {
  reset();
  startBuffering();
});

afterEach(() => {
  reset();
});

xit("should render with minimal props", () => {
  const component = mount(generateComponent());
  expect(mountToJson(component)).toMatchSnapshot();
});

xit("should accept custom classes thru classes prop", () => {
  const component = mount(generateComponent({classes: "test1 test2"}));
  expect(mountToJson(component)).toMatchSnapshot();
});

xit("should accept multiple accounts through accounts prop", () => {
  const component = mount(generateComponent({
    accounts: [
      {value: "hello"},
      {value: "world"},
    ],
  }));
  expect(mountToJson(component)).toMatchSnapshot();

  //one additional for "select fund" default
  expect(component.find("option").length).toEqual(3);
});

xit("should accept state prop with id and fund", () => {
  const component = mount(generateComponent({
    state: {
      id: "dis-account",
      fund: "dis-cool-account",
    }
  }));
  expect(mountToJson(component)).toMatchSnapshot();

  const inputProps = component.find("Input").props();
  const selectProps = component.find("Select").props();

  expect(inputProps.id).toEqual("dis-account");
  expect(inputProps.name).toEqual("dis-cool-account");
  expect(selectProps.id).toEqual("dis-account_select");
});

xit("should accept preFill function thru prop", () => {
  const spy = jest.fn();
  spy.mockReturnValue("returned");

  const component = mount(generateComponent({preFill: spy}));
  expect(mountToJson(component)).toMatchSnapshot();

  const inputProps = component.find("Input").props();

  expect(spy).toBeCalled();
  expect(inputProps.defaultValue).toEqual("returned");
});

xit("should accept saveFund function thru prop", () => {
  const spy = jest.fn();
  const component = mount(generateComponent({saveFund: spy}));
  expect(mountToJson(component)).toMatchSnapshot();
});

xit("should accept format function thru prop", () => {
  const spy = jest.fn();

  const component = mount(generateComponent({format: spy}));
  expect(mountToJson(component)).toMatchSnapshot();

  const inputProps = component.find("Input").props();

  expect(inputProps.format).toBeDefined();
});

xit("should accept selectVal function thru prop", () => {

  const component = mount(generateComponent({selectVal: "hi"}));
  expect(mountToJson(component)).toMatchSnapshot();

  const selectProps = component.find("Select").props();

  expect(selectProps.selected).toEqual("hi");
});