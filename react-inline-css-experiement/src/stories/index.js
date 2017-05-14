import React from 'react'
import { storiesOf, action, linkTo, addDecorator } from '@kadira/storybook'
import Button from './Button'
import Welcome from './Welcome'
import {muiTheme} from 'storybook-addon-material-ui'
import App from '../App'
import Animation from './Animation'
import { StyleRoot } from 'radium'

storiesOf('Hover by Radium', module)
.addDecorator(muiTheme())
.addDecorator((story) => <StyleRoot>
  {story()}
</StyleRoot>)
.add('default', () => (<App />))
.add('animation', () => <Animation />)

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')} />
  ))

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ))
