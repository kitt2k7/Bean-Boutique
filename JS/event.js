/* Bean Boutique event registration */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".event-registration-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedEvent = document.querySelector("#event-choice")?.value || "your selected event";
    alert(`Registration successful!\n\nYou have registered for ${selectedEvent}.\nWe will contact you by email with the event details.`);

    form.reset();
  });
});
