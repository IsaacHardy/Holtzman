import { Component, PropTypes} from "react"
import { connect } from "react-redux"

import { GraphQL } from "../../graphql"
import Nav from "../nav"
import Modal from "../modal"
import { People, Likes } from "../../collections"
import Meta from "../../components/meta"

import {
  accounts as accountsActions,
  liked as likedActions,
  topics as topicActions,
  campuses as campusActions,
  collections as collectionActions,
} from "../../store"

import Styles from "./Styles"

const Watermark = () => (
  <div className={Styles["global-watermark"]}>
    <h4 className={`soft-half flush text-light-primary uppercase watermark ${Styles["watermark"]} visuallyhidden@handheld`}>
      NewSpring
    </h4>
  </div>
)


const App = ({ children, className }) => (
  <div className="
    push-double-bottom@handheld soft-bottom@handheld
    push-double-left@lap-and-up soft-double-left@lap-and-up
    "
  >
    <div className={className}>
      <Meta />
      {children}


      <Modal/>
      <Nav />
      <Watermark />
    </div>

  </div>
)


// @TODO move to saga?
function getUser(id, dispatch) {

  // this is probably to heavy of a universal call?

  // @TODO figure out caching issues?
  let personQuery = `
    {
      person(cache: false) {
        age
        birthdate
        birthDay
        birthMonth
        birthYear
        campus {
          name
          shortCode
          id
        }
        home {
          city
          country
          id
          zip
          state
          street1
          street2
        }
        firstName
        lastName
        nickName
        email
        phoneNumbers {
          number
          formated
        }
        photo
      }
    }
  `

  return GraphQL.query(personQuery)
    .then(({ person }) => {
      if (person) {
        dispatch(accountsActions.person(person))
      }

    })

}

let hasBeenSignedIn = false;
function bindLogout(dispatch) {
  let handle = {}

  Tracker.autorun((computation) => {
    handle = computation
    const user = Meteor.userId()

    if (!user && hasBeenSignedIn) {
      dispatch(collectionActions.clear("savedAccounts"));
      dispatch(accountsActions.authorize(false));
      dispatch(accountsActions.signout());
      hasBeenSignedIn = false;
      return;
    }

    if (user) {
      hasBeenSignedIn = true;
      return getUser(user, dispatch)
    }

  })

  return handle
}

function prefillRedux(dispatch) {
  Tracker.autorun((computation) => {

    Meteor.subscribe("recently-liked")

    if (Meteor.userId()) {

      Meteor.subscribe("userData");
      let topics = Meteor.user() ? Meteor.user().topics : [];
      if (topics && topics.length) {
        dispatch(topicActions.set(topics));
      }

      Meteor.subscribe("likes")

      let likes = Likes.find({
        userId: Meteor.userId()
      }).fetch().map((like) => like.entryId);

      if (likes.length){
        dispatch(likedActions.set(likes));
      }

    }

  });
}


@connect()
export default class Global extends Component {

  state = {
    shouldAnimate: false
  }

  static childContextTypes = {
    shouldAnimate: PropTypes.bool
  }

  getChildContext() {
    return {
      shouldAnimate: this.state.shouldAnimate
    }
  }

  componentDidMount() {
    this.setState({ shouldAnimate: true });
    const { dispatch } = this.props

    bindLogout(dispatch);
    prefillRedux(dispatch);

    let query = `
      {
        campuses: allCampuses {
          name
          shortCode
          id
          locationId
          guid
        }
      }
    `

    GraphQL.query(query)
      .then(({ campuses }) => {

        let mappedObj = {}
        for (let campus of campuses) {
          mappedObj[campus.id] = campus
        }

        dispatch(campusActions.add(mappedObj))

      })

  }

  render() { return <App {...this.props} /> }

}