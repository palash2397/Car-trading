const user1 = {
  name: "Pallu",

  address: {
    city: "Bhopal"
  }
};

const user2 = JSON.parse(JSON.stringify(user1));
user2.address.city = "Delhi";

console.log(user1.address.city);