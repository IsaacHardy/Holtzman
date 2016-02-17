import { Component, PropTypes} from "react"
import { Link } from "react-router"

import { ImageLoader } from "../loading"

import Styles from "../loading/FeedItemSkeleton.css"

export default class Card extends Component {

  static propTypes = {
    classes: PropTypes.array,
    theme: PropTypes.string,
    link: PropTypes.string,
    image: PropTypes.object,
    styles: PropTypes.object
  }

  itemClasses = () => {
    let classes = [
      "card__item",
      "soft",
      "text-left",
      "soft-double-ends@handheld",
      "soft-double@anchored",
      "one-whole",
      "three-fifths@lap-wide",
      "one-half@anchored",
    ];

    if (this.props.itemClasses) {
      classes = classes.concat(this.props.itemClasses);
    }

    return classes.join(" ");
  }

  cardClasses = () => {
    let classes = [
      "card",
    ];

    if (this.props.classes) {
      classes = classes.concat(this.props.classes);
    }

    return classes.join(" ");
  }

  styles = () => {
    let defaultStyles = {
      overflow: "hidden"
    }

    if (this.props.image && this.props.image.full) {
      defaultStyles.backgroundImage = `url(${this.props.image.url})`
    }

    return defaultStyles
  }

  // context from ImageLoader
  preloader() {
    return (
      <div className={`${this.imageclasses.join(" ")} ${Styles["load-item"]}`}>
        <div className="ratio__item"></div>
      </div>
    );
  }

  // context from ImageLoader
  renderElement() {
    return (
      <div className={this.imageclasses.join(" ")} style={this.style}>
        <div className="ratio__item"></div>
      </div>
    );
  }

  createImage = () => {

    const { image } = this.props

    if (image) {
      let imageclasses = [
        "background--fill",
        "card__image",
        "locked-ends@lap-and-up",
        "locked-sides@lap-and-up",
        "relative@handheld"
      ]

      if (image.ratio) {
        imageclasses.push(`ratio--${image.ratio}`)
      } else {
        imageclasses.push("ratio--landscape")
      }

      let style
      if (image.full != true) {
        style = {
          backgroundImage: `url(${image.url})`,
        }
      }

      return (
        <ImageLoader
          src={image.url}
          preloader={this.preloader}
          renderElement={this.renderElement}
          imageclasses={imageclasses}
          style={style}
        />
      )
    }
  }

  render () {

    const { link, image, theme, styles, itemTheme, itemStyles } = this.props

    let Wrapper = Link

    if (!link) {
      Wrapper = class ALink extends Component {
        render() {
          return (
            <div {...this.props}>
              {this.props.children}
            </div>
          )
        }
      }
    }

    let wrapperClasses = "relative@handheld plain locked-ends@lap-and-up locked-right@lap-and-up one-whole@handheld two-fifths@lap-wide one-half@anchored"
    if (this.props.mobile === false) {
      wrapperClasses += " visuallyhidden@handheld visuallyhidden@lap"
    }

    return (
      <div
        className={theme || this.cardClasses()}
        style={styles || this.styles() }
        >
        <Wrapper className={wrapperClasses} to={link}>
          {this.createImage()}
        </Wrapper>
        <div
          className={ itemTheme || this.itemClasses() }
          style={itemStyles}
        >
          {this.props.children}
        </div>

      </div>

    )
  }

}