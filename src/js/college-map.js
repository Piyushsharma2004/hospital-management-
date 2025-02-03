jsVectorMap.addMap("university_campus", {
  insets: [
    {
      width: 900.0,
      top: 0,
      height: 550.0,
      bbox: [
        { y: -1000, x: -1000 },
        { y: 1000, x: 1000 }
      ],
      left: 0
    }
  ],
  paths: {
    "ENGINEERING": {
      path: "M200,100 L300,100 L300,200 L250,200 L250,150 L200,150 Z",
      name: "Engineering Block"
    },
    "SCIENCE": {
      path: "M350,100 L500,100 L500,180 L350,180 Z",
      name: "Science Block"
    },
    "LAW": {
      path: "M200,250 L350,250 L350,350 L200,350 Z",
      name: "Law Block"
    },
    "DESIGN": {
      path: "M400,250 L500,250 L500,300 L450,300 L450,350 L400,350 Z",
      name: "Design Block"
    },
    "ADMIN": {
      path: "M550,150 L650,150 L650,250 L550,250 Z",
      name: "Admin Block"
    }
  },
  height: 550,
  projection: { type: "miller" },
  width: 900,
});