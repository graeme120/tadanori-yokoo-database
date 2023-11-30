// Define a function to generate random number between min and max

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to make an element draggable
function makeDraggable(element) {
  let posX = 0,
    posY = 0,
    posInitX = 0,
    posInitY = 0;

  element.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    posInitX = e.clientX;
    posInitY = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    posX = posInitX - e.clientX;
    posY = posInitY - e.clientY;
    posInitX = e.clientX;
    posInitY = e.clientY;
    element.style.top = element.offsetTop - posY + "px";
    element.style.left = element.offsetLeft - posX + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

window.onload = async function () {
  const CHANNEL_ID = "tadanori-yokoo-d6v92rgjtew";
  const API_KEY = import.meta.env.VITE_ARENA_API_KEY;
  const ARENA_API_CHANNEL_URL = `https://api.are.na/v2/channels/${CHANNEL_ID}`;

  const faceButton = document.getElementById("face-button");
  const imagesContainer = document.getElementById("images-container");

  // Function to generate and display random images
  function generateRandomImages() {
    imagesContainer.innerHTML = "";

    const numBlocksToDisplay = getRandomNumber(7, 20);
    const usedIndexes = [];

    let delay = 0;

    for (let i = 0; i < numBlocksToDisplay; i++) {
      let randomBlockIndex;

      do {
        randomBlockIndex = getRandomNumber(0, channelData.contents.length - 1);
      } while (usedIndexes.includes(randomBlockIndex));

      usedIndexes.push(randomBlockIndex);

      const blockData = channelData.contents[randomBlockIndex];
      const div = document.createElement("div");
      div.classList.add("random-image");
      div.style.position = "absolute";
      div.style.top = `${getRandomNumber(0, 80)}%`;
      div.style.left = `${getRandomNumber(0, 80)}%`;
      div.style.width = `${getRandomNumber(10, 30)}%`;

      const img = document.createElement("img");
      img.src = blockData.image.original.url;
      img.style.width = "100%";
      img.classList.add("notVisible");

      imagesContainer.appendChild(div);
      setTimeout(() => {
        img.classList.add("fade-in-image");
      }, delay);
      delay += 50;

      div.appendChild(img);
      makeDraggable(div);
    }
  }

  async function fetchChannelData() {
    const response = await fetch(ARENA_API_CHANNEL_URL, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    if (!response.ok) {
      console.error(`Failed to fetch channel data: ${response.statusText}`);
      return null;
    }
    return await response.json();
  }

  const channelData = await fetchChannelData();
  if (!channelData || !Array.isArray(channelData.contents)) {
    console.error(
      "Failed to fetch the channel data or data format is incorrect"
    );
    return;
  }

  console.log(channelData);

  // Event listener for the 'face-button' click
  let isImagesVisible = false;

  faceButton.addEventListener("click", () => {
    if (isImagesVisible) {
      imagesContainer.innerHTML = "";
      generateRandomImages();
    } else {
      generateRandomImages();
    }
    isImagesVisible = !isImagesVisible;
  });
};
