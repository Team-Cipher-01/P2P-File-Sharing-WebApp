export default function() {
  return [
    {
      title: "Home",
      htmlBefore: '<img style="padding:5px" src="../../../images/icons/home.svg" alt="Shards Dashboard"/>',
      to: "/home",
    },
    {
      title: "Search",
      htmlBefore: '<img style="padding:5px" src="../../../images/icons/search.svg" alt="Shards Dashboard"/>',
      to: "/search",
    },
    {
      title: "Your Library",
      htmlBefore: '<img style="padding:5px" src="../../../images/icons/cc_library.svg" alt="Shards Dashboard"/>',
      to: "/routes",
    },
    {
      title: "Shared Files",
      to: "/routes",
      htmlBefore: '<img style="padding:5px" src="../../../images/icons/user_group.svg" alt="Shards Dashboard"/>',
      htmlAfter: ""
    },
    {
      title: "Deleted Files",
      htmlBefore: '<img style="padding:5px" src="../../../images/icons/delete.svg" alt="Shards Dashboard"/>',
      to: "/routes",
    },
    {
      title: "Logout",
      htmlBefore: '<img style="padding:5px" src="../../../images/icons/logout.svg" alt="Shards Dashboard"/>',
      to: "/login",
    },
  ];
}
