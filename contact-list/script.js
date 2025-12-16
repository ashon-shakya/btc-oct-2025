let contactList = [
  {
    gender: "female",
    name: {
      title: "Mrs",
      first: "Megan",
      last: "French",
    },
    location: {
      street: {
        number: 1482,
        name: "Cedar St",
      },
      city: "Field",
      state: "British Columbia",
      country: "Canada",
      postcode: "T2O 5U0",
      coordinates: {
        latitude: "-70.2452",
        longitude: "147.9215",
      },
      timezone: {
        offset: "+3:30",
        description: "Tehran",
      },
    },
    email: "megan.french@example.com",
    login: {
      uuid: "d4792351-1df5-4f0f-bf64-0828da73c7c9",
      username: "crazybear550",
      password: "ghost",
      salt: "17v9b7T0",
      md5: "1f22f83a960f3f19fd585b1e9f0f5c80",
      sha1: "6d564e1251c53a0e7c6c6aa5016d94648b997046",
      sha256:
        "1d879ed5536e5ed5dcf9ddca006f6e51f2773a916c2ed8b435adc2acbe198bbd",
    },
    dob: {
      date: "1952-12-20T21:23:00.517Z",
      age: 72,
    },
    registered: {
      date: "2012-12-01T18:38:50.808Z",
      age: 13,
    },
    phone: "R41 U47-5986",
    cell: "D85 A46-5850",
    id: {
      name: "SIN",
      value: "310180013",
    },
    picture: {
      large: "https://randomuser.me/api/portraits/women/83.jpg",
      medium: "https://randomuser.me/api/portraits/med/women/83.jpg",
      thumbnail: "https://randomuser.me/api/portraits/thumb/women/83.jpg",
    },
    nat: "CA",
  },
];

const renderContactList = () => {
  const contactListElement = document.getElementById("contact-list");

  let cardList = "";

  for (contact of contactList) {
    let card = `<div
                class="card bg-green-950  rounded-[40px] w-[250px] h-[450px] border-[8px] border-green-950 overflow-hidden flex flex-col gap-4 relative justify-end">
                <div class="card-image bg-slate-200 absolute h-full">
                    <img src="${contact.picture.large}"
                        class="h-full w-full object-cover ab" alt="" srcset="">
                </div>

                <div
                    class="card-details flex flex-col gap-2 text-gray-300 p-2 z-2 bg-gradient-to-b from-transparent  to-black min-h-[100px] transition-all delay-150 duration-300 ease-in-out">
                    <div class="card-title text-2xl text-white">
                        ${contact.name.title} ${contact.name.first} ${
      contact.name.last
    }
                    </div>
                    <div class="card-desc font-light">
                        ${contact.location.city}, ${contact.location.state} ${
      contact.location.postcode
    }
                    </div>
                    <div
                        class="card-footer font-light flex flex-col justify-start items-center pb-4 h-[20px] overflow-hidden hover:h-[100px] cursor-pointer transition-all duration-300 ease-in-out ">
                        <div class="card-follow-btn w-full  flex justify-center animate-bounce">
                            <i class="fa-solid fa-arrow-down-long"></i>
                        </div>
                        <div class="card-icons flex flex-col gap-2 text-xs text-gray-300 w-full">
                            <div class="card-icon">
                                <i class="fa-solid fa-mobile-screen"></i>
                                ${contact.cell}

                            </div>
                            <div class="card-icon">
                                <i class="fa-solid fa-at"></i>
                                ${contact.email}

                            </div>

                            <div class="card-icon">
                                <i class="fa-regular fa-calendar-check"></i>
                                ${contact.dob.date.split("T")[0]}

                            </div>


                        </div>

                    </div>
                </div>
            </div>
`;

    cardList += card;
  }

  contactListElement.innerHTML = cardList;
};

const fetchContact = async (contactNumber = 10) => {
  const apiUrl = `https://randomuser.me/api?results=${contactNumber}`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  contactList = data.results;

  renderContactList();
};

fetchContact(9);
