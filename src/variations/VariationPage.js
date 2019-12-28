import React from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';

import * as Variations from './Variations';
import { decodeProps } from '../testUtils';


const mapVariations = (fn) => Object.keys(Variations).map(fn);

export const VariationList = () => {
  const match = useRouteMatch();

  return (
    <ul>
      {
        mapVariations((variation) => {
          return <li key={variation}><Link to={`${match.path}/${variation}`}>{variation}</Link></li>
        })
      }
    </ul>
  )
};

export const withURLProps = (Component) => {
  const queryProps = new URLSearchParams(location.search).get('props');
  let urlProps = {};
  if (queryProps) {
    urlProps = decodeProps(queryProps);
  }

  return (props) => {
    const overriddenProps = {...props, ...urlProps};
    return <Component {...overriddenProps}/>
  }
};

export const withPropsDebug = (Component) => {
  return (props) => {
    return (
      <>
        <Component {...props}/>
        <pre>{JSON.stringify(props, null, 3)}</pre>
      </>
    )
  }
};

export const withComponentSourceCode = (Component) => {
  // TODO: experiment with replacing prop names in component source code with the actual props
  return (props) => {
    return (
      <>
        <Component {...props}/>
        <pre>{Component.toString()}</pre>
      </>
    )
  }
};

export const VariationPage = () => {
  const match = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${match.path}`} exact={true}>
          <VariationList/>
        </Route>

        {
          mapVariations((variation) => {
            const Variation = withURLProps(withPropsDebug(withComponentSourceCode(Variations[variation])));
            return (
              <Route path={`${match.path}/${variation}`} key={variation}>
                <Variation/>
              </Route>
            )
          })
        }
      </Switch>
    </div>
  )
};