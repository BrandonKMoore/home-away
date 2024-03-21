import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import LandingPage from './components/LandingPage';
import Navigation from './components/Navigation/Navigation';
import GroupEventHeader from './components/GroupEventHeader';
import * as sessionActions from './store/session';
import { Modal } from './context/Modal';
import Groups from './components/Groups';
import Events from './components/Events';
import GroupDetails from './components/GroupDetails';
import GroupFormNew from './components/GroupFormNew';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Modal/>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      // {
      //   path: 'login',
      //   element: <LoginFormPage />
      // },
      // {
      //   path: 'signup',
      //   element: <SignupFormPage />
      // }
      {
        path: 'groups',
        children: [
          {
            index: true,
            element: <Groups />,
          },
          {
            path: ':groupId',
            element: <GroupDetails />
          },
          {
            path: 'new',
            element: <GroupFormNew />
          }
        ]
      },
      {
        path: 'events',
        element: <Events />,
        children: []
      },
      {
        path: '*',
        element: <h2>This Page Couldn&apos;t be found</h2>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
