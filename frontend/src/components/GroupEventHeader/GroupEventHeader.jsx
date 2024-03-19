import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import './GroupEventHeader.css'

export default function GroupEventHeader(){

  return (
    <div className="small-page-container">
      <nav id="group-event-nav">
        <NavLink to='events'><h2>Events</h2></NavLink>
        <NavLink to='groups'><h2>Groups</h2></NavLink>
      </nav>
      <span>{} in Meetup</span>
      <Outlet />
    </div>
  )
}
