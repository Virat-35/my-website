// ============================================
// BUS RESERVATION SYSTEM
// ============================================

let selectedBus = "";
let ticketPrice = 0;
let selectedSeats = [];


// ============================================
// PAGE NAVIGATION
// ============================================

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageId === "bookings") {
        displayBookings();
    }
}


// ============================================
// SET TODAY'S DATE
// ============================================

document.addEventListener("DOMContentLoaded", function() {

    const dateInput = document.getElementById("journeyDate");

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    dateInput.min = formattedDate;
    dateInput.value = formattedDate;

    displayBookings();
});


// ============================================
// SEARCH BUSES
// ============================================

function searchBuses() {

    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    const date = document.getElementById("journeyDate").value;
    const passengers = document.getElementById("passengers").value;

    if (!from || !to || !date) {
        alert("Please enter From, To and Journey Date.");
        return;
    }

    if (from.toLowerCase() === to.toLowerCase()) {
        alert("From and To locations cannot be the same.");
        return;
    }

    document.getElementById("routeInfo").innerHTML =
        `🚌 ${from} → ${to} &nbsp; | &nbsp;
         📅 ${formatDate(date)} &nbsp; | &nbsp;
         👥 ${passengers} Passenger(s)`;

    showPage("results");
}


// ============================================
// OPEN SEAT SELECTION
// ============================================

function openSeats(busName, price) {

    selectedBus = busName;
    ticketPrice = price;
    selectedSeats = [];

    document.getElementById("summaryBus").textContent = busName;
    document.getElementById("summarySeats").textContent = "None";
    document.getElementById("summaryTotal").textContent = "₹0";

    createSeats();

    showPage("seats");
}


// ============================================
// CREATE SEATS
// ============================================

function createSeats() {

    const seatGrid = document.getElementById("seatGrid");

    seatGrid.innerHTML = "";

    for (let i = 1; i <= 24; i++) {

        const seat = document.createElement("button");

        seat.className = "seat";
        seat.textContent = i;

        // Example booked seats
        if ([3, 7, 12, 18].includes(i)) {

            seat.classList.add("booked");
            seat.disabled = true;

        } else {

            seat.onclick = function() {
                toggleSeat(i, seat);
            };

        }

        seatGrid.appendChild(seat);
    }
}


// ============================================
// SELECT / UNSELECT SEAT
// ============================================

function toggleSeat(number, element) {

    if (selectedSeats.includes(number)) {

        selectedSeats = selectedSeats.filter(
            seat => seat !== number
        );

        element.classList.remove("selected");

    } else {

        const maxPassengers =
            parseInt(document.getElementById("passengers").value);

        if (selectedSeats.length >= maxPassengers) {

            alert(
                `You can select maximum ${maxPassengers} seat(s).`
            );

            return;
        }

        selectedSeats.push(number);

        element.classList.add("selected");
    }

    updateSummary();
}


// ============================================
// UPDATE BOOKING SUMMARY
// ============================================

function updateSummary() {

    const seatsText =
        selectedSeats.length > 0
        ? selectedSeats.join(", ")
        : "None";

    const total =
        selectedSeats.length * ticketPrice;

    document.getElementById("summarySeats")
        .textContent = seatsText;

    document.getElementById("summaryTotal")
        .textContent = `₹${total}`;
}


// ============================================
// CONTINUE TO PASSENGER DETAILS
// ============================================

function continuePassenger() {

    if (selectedSeats.length === 0) {

        alert("Please select at least one seat.");

        return;
    }

    const from =
        document.getElementById("from").value;

    const to =
        document.getElementById("to").value;

    const date =
        document.getElementById("journeyDate").value;

    const total =
        selectedSeats.length * ticketPrice;

    document.getElementById("passengerSummary").innerHTML =
        `<strong>${selectedBus}</strong><br>
        ${from} → ${to}<br>
        Date: ${formatDate(date)}<br>
        Seats: ${selectedSeats.join(", ")}<br>
        Total Fare: <strong>₹${total}</strong>`;

    showPage("passenger");
}


// ============================================
// CONFIRM BOOKING
// ============================================

function confirmBooking() {

    const name =
        document.getElementById("passengerName").value.trim();

    const age =
        document.getElementById("passengerAge").value;

    const phone =
        document.getElementById("phone").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const gender =
        document.getElementById("gender").value;

    if (!name || !age || !phone || !email || !gender) {

        alert("Please fill in all passenger details.");

        return;
    }

    if (phone.length < 10) {

        alert("Please enter a valid phone number.");

        return;
    }

    const bookingId =
        "BG" + Math.floor(100000 + Math.random() * 900000);

    const from =
        document.getElementById("from").value;

    const to =
        document.getElementById("to").value;

    const date =
        document.getElementById("journeyDate").value;

    const total =
        selectedSeats.length * ticketPrice;


    const booking = {

        id: bookingId,
        bus: selectedBus,
        from: from,
        to: to,
        date: date,
        passenger: name,
        age: age,
        phone: phone,
        email: email,
        gender: gender,
        seats: [...selectedSeats],
        fare: total

    };


    // Save booking in browser
    const bookings =
        JSON.parse(localStorage.getItem("busBookings")) || [];

    bookings.push(booking);

    localStorage.setItem(
        "busBookings",
        JSON.stringify(bookings)
    );


    // Display confirmation

    document.getElementById("bookingId")
        .textContent = bookingId;

    document.getElementById("ticketBus")
        .textContent = selectedBus;

    document.getElementById("ticketFrom")
        .textContent = from;

    document.getElementById("ticketTo")
        .textContent = to;

    document.getElementById("ticketPassenger")
        .textContent = name;

    document.getElementById("ticketDate")
        .textContent = formatDate(date);

    document.getElementById("ticketSeats")
        .textContent = selectedSeats.join(", ");

    document.getElementById("ticketFare")
        .textContent = `₹${total}`;

    showPage("confirmation");
}


// ============================================
// DISPLAY BOOKINGS
// ============================================

function displayBookings() {

    const container =
        document.getElementById("bookingList");

    const bookings =
        JSON.parse(localStorage.getItem("busBookings")) || [];

    if (bookings.length === 0) {

        container.innerHTML = `
            <div class="empty-bookings">

                <div>🎫</div>

                <h2>No bookings yet</h2>

                <p>
                    Your confirmed bookings will appear here.
                </p>

                <button class="primary-btn"
                        onclick="showPage('home')">
                    Book a Bus
                </button>

            </div>
        `;

        return;
    }


    container.innerHTML = "";


    bookings.forEach((booking, index) => {

        const card =
            document.createElement("div");

        card.className = "saved-booking";

        card.innerHTML = `

            <div class="saved-booking-header">

                <div>
                    <h2>${booking.bus}</h2>
                    <p>Booking ID: ${booking.id}</p>
                </div>

                <span class="status">
                    Confirmed
                </span>

            </div>

            <div class="booking-info">

                <div>
                    <small>Route</small>
                    <strong>
                        ${booking.from} → ${booking.to}
                    </strong>
                </div>

                <div>
                    <small>Date</small>
                    <strong>
                        ${formatDate(booking.date)}
                    </strong>
                </div>

                <div>
                    <small>Seats</small>
                    <strong>
                        ${booking.seats.join(", ")}
                    </strong>
                </div>

                <div>
                    <small>Total Fare</small>
                    <strong>
                        ₹${booking.fare}
                    </strong>
                </div>

            </div>

            <br>

            <button class="secondary-btn"
                    onclick="cancelBooking(${index})">
                Cancel Booking
            </button>

        `;

        container.appendChild(card);

    });
}


// ============================================
// CANCEL BOOKING
// ============================================

function cancelBooking(index) {

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this booking?"
        );

    if (!confirmCancel) {
        return;
    }

    const bookings =
        JSON.parse(localStorage.getItem("busBookings")) || [];

    bookings.splice(index, 1);

    localStorage.setItem(
        "busBookings",
        JSON.stringify(bookings)
    );

    displayBookings();

    alert("Booking cancelled successfully.");
}


// ============================================
// REGISTER USER
// ============================================

function registerUser() {

    const name =
        document.getElementById("registerName")
        .value.trim();

    const email =
        document.getElementById("registerEmail")
        .value.trim();

    const password =
        document.getElementById("registerPassword")
        .value;

    if (!name || !email || !password) {

        alert("Please fill in all fields.");

        return;
    }

    const user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem(
        "busUser",
        JSON.stringify(user)
    );

    alert("Registration successful!");

    document.getElementById("registerName").value = "";
    document.getElementById("registerEmail").value = "";
    document.getElementById("registerPassword").value = "";

    showPage("login");
}


// ============================================
// LOGIN
// ============================================

function loginUser() {

    const email =
        document.getElementById("loginEmail")
        .value.trim();

    const password =
        document.getElementById("loginPassword")
        .value;

    const user =
        JSON.parse(localStorage.getItem("busUser"));


    if (!user) {

        alert("No account found. Please register first.");

        showPage("register");

        return;
    }


    if (
        email === user.email &&
        password === user.password
    ) {

        localStorage.setItem("loggedIn", "true");

        alert(`Welcome, ${user.name}!`);

        showPage("home");

    } else {

        alert("Invalid email or password.");

    }
}


// ============================================
// FORMAT DATE
// ============================================

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}
