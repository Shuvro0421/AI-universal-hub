let currentSortState = false; // Global variable to track sorting state

const loadData = async (isShowAll) => {
    const response = await fetch(`https://openapi.programming-hero.com/api/ai/tools`);
    const data = await response.json();
    const allData = data.data.tools;

    const sortState = currentSortState; // Store the current sorting state
    if (sortState) {
        allData.sort((a, b) => {
            const dateA = new Date(a.published_in);
            const dateB = new Date(b.published_in);
            return dateB - dateA; // Sort in descending order (newest first)
        });
    }
    allCards(allData, isShowAll);
};
const allCards = (allDatas, isShowAll) => {

    const showAllButton = document.getElementById('show-all-button');
    const allCards = document.getElementById('all-cards');



    if (!isShowAll) {
        allDatas = allDatas.slice(0, 6);
        showAllButton.classList.remove('hidden');
    }
    else {
        showAllButton.classList.add('hidden');
    }
    allCards.innerHTML = '';


    allDatas.forEach(allData => {
        const features = allData.features;

        const cardDiv = document.createElement('div');
        cardDiv.classList = `card bg-base-100 border-2 border-gray-200 p-5`;
        cardDiv.innerHTML = `
            <img class="rounded-xl" src="${allData?.image ? allData.image : 'No Image'}" alt="image" />
            <div class="mt-5 space-y-3">
                <h2 class="card-title font-bold">Features</h2>
                <div class="text-gray-500">
                    ${features.map((feature, index) => `
                        <p class="">
                            <span class="feature-count">${index + 1}.</span> ${feature}
                        </p>`
        ).join('')}
                </div>
                <p class="border-b-2"></p>
                <p class="font-bold text-xl">${allData?.name ? allData.name : 'No Name'}</p>
                <div class="flex justify-between">
                    <p class="flex items-center gap-2"><i class="fa-solid fa-calendar-days text-xl" style="color: #000000;"></i>${allData.published_in}</p>
                    <button onclick="showDetails('${allData.id}')" class="btn rounded-full bg-red-100 bg-opacity-50"><i class="fa-solid fa-arrow-right" style="color: #ff5757;"></i></button>
                </div>
            </div>
        `;
        allCards.appendChild(cardDiv);
        

    });
}


const sortByDateButton = () => {
    currentSortState = !currentSortState; // Toggle the sorting state
    loadData(false);
};

// show all 
const showAllButton = () => {
    loadData(true);
};

// click modal by id
const showDetails = async (id) => {
    const response = await fetch(`https://openapi.programming-hero.com/api/ai/tool/${id}`);
    const data = await response.json();
    const modalId = data.data;
    console.log(modalId);
    loadDetails(modalId);
}

const loadDetails = (modalId) => {

    const integrations = modalId.integrations;

    console.log(integrations);
    const mainModalCard = document.getElementById('main-modal-card');
    const modalCardDiv = document.createElement('div');
    modalCardDiv.classList = `flex md:flex-row flex-col gap-4`;
    modalCardDiv.innerHTML = `
        <div class="card  bg-pink-100  border-2 border-red-300">
            <div class="p-5">
                <h2 class="card-title font-bold">${modalId.description}</h2>
                <div class="flex md:flex-row flex-col gap-5 mt-4">
                    <div class="bg-white rounded-md p-3 text-center font-bold">
                        <p class="text-[#03A30A]">Free of Cost/Basic</p>
                    </div>
                    <div class="bg-white rounded-md p-3 text-center font-bold">
                        <p class="text-[#F28927]">Free Of Cost/Pro</p>
                    </div>
                    <div class="bg-white rounded-md p-3 text-center font-bold">
                        <p class="text-[#EB5757]">Free of Cost /Enterprise</p>
                    </div>
                </div>
                <div class="flex md:flex-row flex-col justify-between text-xl font-bold mt-5">
                    <p class="">Features</p>
                    <div class=" space-y-3">
                    <p class="">Integrations</p>
                    ${integrations && integrations.length > 0
            ? `${integrations.map(integration => `<li class="text-gray-500 font-normal text-base">${integration}</li>`).join('')}`
            : `<p  class="text-gray-500 font-normal text-base">No data Found</p>`}
                    </div>
                </div>
            </div>
        </div>


        <div class="card  bg-white border-2 border-gray-200 p-5">
            <div class="relative">
                
                <img class="rounded-xl" src="${modalId && modalId.image_link && modalId.image_link[0] ? modalId.image_link[0] : 'no Logo'}" alt="image" />
                <div class="absolute right-0 top-0 m-2">
                    ${modalId && modalId.accuracy && modalId.accuracy.score !== null && typeof modalId.accuracy.score !== 'undefined'
                    ? `<p class=" bg-[#EB5757] text-white font-semibold text-center py-1 px-2 rounded-lg z-10">
                        ${modalId.accuracy.score * 100}% accuracy
                    </p>`
                    : ''}
                </div>

            </div>

            <div class="p-5 mt-5 space-y-3">
                <p class="text-xl font-bold text-center">${modalId && modalId.input_output_examples && modalId.input_output_examples[0] && modalId.input_output_examples[0].input ? modalId.input_output_examples[0].input : 'Can you give any example?'}</p>
                <p class="text-gray-500 text-center">${modalId && modalId.input_output_examples && modalId.input_output_examples[0] && modalId.input_output_examples[0].output ? modalId.input_output_examples[0].output : 'No! Not Yet! Take a break!!!'}</p>
            </div>
        </div>
    `
    mainModalCard.textContent = '';
    mainModalCard.appendChild(modalCardDiv);

    my_modal_4.showModal();
}


loadData();
