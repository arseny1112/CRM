window.addEventListener('load', function() {
    let preloader = document.querySelector('.preloader');
    preloader.style.display = 'none';

    let spinner = document.querySelector('.spinner')
    spinner.style.display = 'none'
    let tableBody = document.querySelector('.tbody')
    tableBody.style.display = 'block'

});

document.addEventListener('DOMContentLoaded', async function() {

    // let oneClient = {}
    const SERVER_URL = 'http://localhost:3000'


    async function serverAddClient(obj) {
        let serverError = document.querySelector('.serverError')
        try {
            // Выполняем запрос
            let response = await fetch(SERVER_URL + '/api/clients', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj),
            });

            // Проверяем HTTP-статус
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Пытаемся разобрать JSON
            let data;
            try {
                data = await response.json();
            } catch (error) {
                throw new Error('Ошибка при разборе ответа сервера: некорректный JSON');
            }

            // Проверяем данные на ожидаемую структуру
            if (!data || typeof data !== 'object' || !data.id) {
                throw new Error('Ответ сервера не содержит ожидаемых данных');
            }

            return data; // Всё прошло успешно
        } catch (error) {
            // Обработка ошибок
            serverError.textContent = (`Ошибка при добавлении клиента: ${error.message}`)
            throw error; // Если нужно передать ошибку выше
        }
    }


    async function serverGetClients() {
        let response = await fetch(SERVER_URL + '/api/clients', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let data = await response.json()

        return data
    }

    async function serverUpdateClient(obj) {
        let response = await fetch(SERVER_URL + '/api/clients/' + modalUpdId.textContent, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })



        let data = await response.json()
        return data
    }


    async function serverDeleteClient(id) {
        let response = await fetch(SERVER_URL + '/api/clients/' + id, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
        })

        // const updatedArray = await response.json()

        let data = await response.json()
        return data
    }

    async function searchClient() {
        let response = await fetch(`http://localhost:3000/api/clients?search=${headerSearch.value}`)
    }




    let listData = []
    listData = await serverGetClients()




    // модальное окно
    const modal = document.querySelector('.modal__window')
    const clientsContent = document.querySelector('.clients-content')
    const addClient = document.createElement('button')
    addClient.classList.add('clients-content__btn')
    addClient.textContent = 'Добавить клиента'
    clientsContent.append(addClient)

    const overlay = document.querySelector('.overlay')
    const modalClose = document.querySelector('.modal__close')
    const modalUpdClose = document.querySelector('.modal-upd__close')

    const modalBtnCancel = document.querySelector('.modal__btn-cancel')
    const form = document.querySelector('.modal__form')
    const modalInput = document.querySelectorAll('.modal__input')
    const modalLabel = document.querySelectorAll('.modal__label')
    const modalBtnSave = document.querySelector('.modal__btn-saveContact')

    // подтверждение удаления 
    const modalDel = document.createElement('div')
    modalDel.classList.add('modalDel')
    const modalDelTop = document.createElement('div')
    modalDelTop.classList.add('modalDelTop')

    const modalDelTitle = document.createElement('h3')
    modalDelTitle.classList.add('modalDelTitle')
    modalDelTitle.textContent = 'Удалить клиента'

    const modalDelClose = document.createElement('button')
    modalDelClose.classList.add('modalDelClose')


    const modalDelDesc = document.createElement('p')
    modalDelDesc.classList.add('modalDelDesc')
    modalDelDesc.textContent = 'Вы действительно хотите удалить данного клиента?'
    const modalDelbtn = document.createElement('button')
    modalDelbtn.classList.add('modalDelBtn')
    modalDelbtn.textContent = 'Удалить'
    const modalDelCancel = document.createElement('button')
    modalDelCancel.classList.add('modalDelCancel')
    modalDelCancel.textContent = 'Отмена'


    // окно изменить


    const clients = document.querySelector('.clients')
    const table = document.querySelector('.table')

    const tableHead = document.querySelector('.thead')
    const tableBody = document.querySelector('.tbody')

    const tableHeadTr = document.querySelector('.tableHeadTr')
    const tableHeadID = document.querySelector('.tableHeadID')
    const tableHeadFIO = document.querySelector('.tableHeadFIO')
    const tableHeadDate = document.querySelector('.tableHeadDate')
    const tableHeadUpdates = document.querySelector('.tableHeadUpdates')
    const tableHeadContacts = document.querySelector('.tableHeadContacts')
    const tableHeadActions = document.querySelector('.tableHeadActions')


    table.append(tableHead)
    table.append(tableBody)


    clients.append(modalDel)
    modalDel.append(modalDelTop)
    modalDelTop.append(modalDelTitle)
    modalDelTop.append(modalDelClose)
    modalDel.append(modalDelDesc)
    modalDel.append(modalDelbtn)
    modalDel.append(modalDelCancel)


    let thSort = document.querySelectorAll('.thSort')


    let modalLastName = document.querySelector('.modal__input-lastName')
    let modalName = document.querySelector('.modal__input-name')
    let modalSurname = document.querySelector('.modal__input-surname')

    // Функция для инициализации маски
    function initializeMask(inputField) {
        if (inputField.maskInstance) {
            inputField.maskInstance.destroy();
        }
        inputField.maskInstance = new IMask(inputField, {
            mask: '+{0}(000)000-00-00',
        });
    }

    // Функция для удаления маски, если она есть
    function removeMask(inputField) {
        if (inputField.maskInstance) {
            inputField.maskInstance.destroy();
            inputField.maskInstance = null;
        }
    }

    // Основная функция для добавления контакта
    function modalDropdownFunc() {
        const modalDropdown = document.querySelector('.modal__dropdown');

        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown', 'flex');
        modalDropdown.append(dropdown);

        const dropdownButton = document.createElement('div');
        dropdownButton.classList.add('dropdown__button');
        dropdown.append(dropdownButton);

        const dropdownToggle = document.createElement('input');
        dropdownToggle.classList.add('dropdown-toggle');
        dropdownToggle.setAttribute('type', 'button');
        dropdownToggle.value = 'Телефон'; // Установка значения по умолчанию
        dropdownButton.append(dropdownToggle);

        const dropdownMenu = document.createElement('div');
        dropdownMenu.classList.add('dropdown__menu');
        dropdownButton.append(dropdownMenu);

        const inputDiv = document.createElement('div');
        inputDiv.classList.add('inputDiv');
        dropdown.append(inputDiv);

        const dropdownInput = document.createElement('input');
        dropdownInput.classList.add('dropdown__input');
        dropdownInput.setAttribute('type', 'tel'); // Телефон по умолчанию
        dropdownInput.setAttribute('placeholder', 'Введите данные контакта');
        inputDiv.append(dropdownInput);

        // Устанавливаем маску сразу, так как Телефон — значение по умолчанию
        initializeMask(dropdownInput);

        const options = [{
                label: 'Телефон',
                type: 'tel',
                applyMask: true
            },
            {
                label: 'Доп. телефон',
                type: 'tel',
                applyMask: true
            },
            {
                label: 'Email',
                type: 'email',
                applyMask: false
            },
            {
                label: 'Vk',
                type: 'text',
                applyMask: false
            },
            {
                label: 'Facebook',
                type: 'text',
                applyMask: false
            },
            {
                label: 'Другое',
                type: 'text',
                applyMask: false
            },
        ];

        options.forEach(option => {
            const item = document.createElement('a');
            item.classList.add('dropdown__item');
            item.textContent = option.label;
            dropdownMenu.append(item);

            item.addEventListener('click', () => {
                dropdownToggle.value = option.label;
                dropdownInput.setAttribute('type', option.type);

                // Переключение маски в зависимости от типа поля
                removeMask(dropdownInput); // Удаляем текущую маску
                if (option.applyMask) {
                    initializeMask(dropdownInput); // Применяем маску заново для телефонов
                }
            });
        });

        // Переключение видимости меню
        dropdownToggle.addEventListener('click', (event) => {
            event._isClick = true;
            dropdownMenu.classList.toggle('show-list');
            dropdownToggle.classList.toggle('delBtn__opened');

            if (dropdownMenu.classList.contains('show-list')) {
                document.querySelectorAll('.show-list').forEach(menu => {
                    if (menu !== dropdownMenu) {
                        menu.classList.remove('show-list');
                    }
                });
            }
        });

        document.addEventListener('click', (event) => {
            if (event._isClick) return;
            dropdownMenu.classList.remove('show-list');
            dropdownToggle.classList.remove('delBtn__opened');
        });

        // Кнопка удаления контакта
        const delContact = document.createElement('button');
        delContact.classList.add('delContact');
        inputDiv.append(delContact);

        dropdownInput.addEventListener('input', () => {
            delContact.classList.add('show-delContact');
        }, {
            once: true
        });

        delContact.addEventListener('click', () => {
            removeMask(dropdownInput); // Удаляем маску при удалении контакта
            dropdown.remove();
        });

        // Tooltip
        const tooltip = document.createElement('span');
        tooltip.classList.add('delContact__tooltip');
        tooltip.textContent = 'Удалить контакт';
        delContact.append(tooltip);
    }




    // Глобальная функция для установки маски
    function contactMask(inputField) {
        if (inputField.imaskInstance) {
            inputField.imaskInstance.destroy(); // Удалить существующую маску, если она есть
        }
        inputField.imaskInstance = new IMask(inputField, {
            mask: '+{0}(000)000-00-00',
        });
    }

    // Глобальная функция для удаления маски
    function destroyMask(inputField) {
        if (inputField.imaskInstance) {
            inputField.imaskInstance.destroy();
            inputField.imaskInstance = null;
        }
    }

    // Функция для создания выпадающего списка контакта
    function modalDropdownUpdFunc(inputUpd = '', toggleUpd = 'Телефон') {
        const dropdownUpd = document.createElement('div');
        dropdownUpd.classList.add('dropdownUpd', 'flex');

        const dropdownButtonUpd = document.createElement('div');
        dropdownButtonUpd.classList.add('dropdown-upd__button');
        dropdownUpd.append(dropdownButtonUpd);

        const dropdownToggleUpd = document.createElement('input');
        dropdownToggleUpd.classList.add('dropdownUpd-toggle');
        dropdownToggleUpd.setAttribute('type', 'button');
        dropdownToggleUpd.setAttribute('data-target', '#modal');
        dropdownToggleUpd.value = toggleUpd;
        dropdownButtonUpd.append(dropdownToggleUpd);

        const dropdownMenuUpd = document.createElement('div');
        dropdownMenuUpd.classList.add('dropdownUpd-menu');
        dropdownMenuUpd.setAttribute('id', 'modal');
        dropdownButtonUpd.append(dropdownMenuUpd);

        const inputDivUpd = document.createElement('div');
        inputDivUpd.classList.add('inputDivUpd');
        dropdownUpd.append(inputDivUpd);

        const dropdownInputUpd = document.createElement('input');
        dropdownInputUpd.classList.add('dropdown__inputUpd', 'phones');
        dropdownInputUpd.value = inputUpd;
        dropdownInputUpd.setAttribute('type', 'tel');
        dropdownInputUpd.setAttribute('inputmode', 'tel');
        dropdownInputUpd.setAttribute('placeholder', 'Введите данные контакта');
        inputDivUpd.append(dropdownInputUpd);

        document.querySelector('.modal-upd__dropdown').append(dropdownUpd);

        contactMask(dropdownInputUpd); // Применить маску по умолчанию

        // Функции для обработки выбора контакта
        function setupDropdownItem(label, type, hasMask) {
            const item = document.createElement('a');
            item.classList.add('dropdownUpd-item');
            item.textContent = label;
            item.addEventListener('click', () => {
                dropdownToggleUpd.value = label;
                dropdownInputUpd.setAttribute('type', type);
                if (hasMask) {
                    dropdownInputUpd.classList.add('phones');
                    contactMask(dropdownInputUpd);
                } else {
                    dropdownInputUpd.classList.remove('phones');
                    destroyMask(dropdownInputUpd);
                }
            });
            dropdownMenuUpd.append(item);
        }

        // Создание элементов выбора
        setupDropdownItem('Телефон', 'tel', true);
        setupDropdownItem('Доп. телефон', 'tel', true);
        setupDropdownItem('Email', 'email', false);
        setupDropdownItem('Vk', 'text', false);
        setupDropdownItem('Facebook', 'text', false);
        setupDropdownItem('Другое', 'text', false);

        // Переключение отображения меню
        dropdownToggleUpd.addEventListener('click', function(event) {
            event._isClick = true;
            dropdownMenuUpd.classList.toggle('show-list');
            dropdownToggleUpd.classList.toggle('delBtn__opened');
        });

        document.addEventListener('click', function(event) {
            if (!event._isClick) {
                dropdownMenuUpd.classList.remove('show-list');
                dropdownToggleUpd.classList.remove('delBtn__opened');
            }
        });

        // Удаление контакта
        const delContactUpd = document.createElement('button');
        delContactUpd.classList.add('delContactUpd');
        inputDivUpd.append(delContactUpd);

        delContactUpd.addEventListener('click', () => {
            dropdownUpd.remove();
            addContactUpd.style.display = 'flex';
        });

        // Показ кнопки удаления при вводе текста
        dropdownInputUpd.addEventListener('input', () => {
            delContactUpd.classList.toggle('show-delContactUpd', dropdownInputUpd.value !== '');
        });
    }



    let addContact = document.querySelector('.modal__btn-addContact')
    let dropdown = document.querySelector('.dropdown')
    let modalBtn = document.querySelector('.modal__btn')
    let addContactUpd = document.querySelector('.modal-upd__btn-addContact')
    let dropdownUpd = document.querySelector('.modal-upd__dropdown')



    addContact.addEventListener('click', function() {
        modalDropdownFunc()

        if (document.querySelectorAll('.dropdown').length >= 10) {
            addContact.style.display = 'none'
        } else {
            addContact.style.display = 'flex'
        }
    });

    addContactUpd.addEventListener('click', function() {
        modalDropdownUpdFunc()

        if (document.querySelectorAll('.dropdownUpd').length >= 10) {
            addContactUpd.style.display = 'none'
        } else {
            addContactUpd.style.display = 'flex'
        }

    });


    function modalWindow() {
        // кнопки
        addClient.addEventListener('click', e => {
            modal.style.display = 'flex'
            overlay.classList.toggle('overlay-show')
        })


        modalBtnCancel.addEventListener('click', e => {
            modal.style.display = 'none'
            overlay.classList.remove('overlay-show')
        })
        modalClose.addEventListener('click', e => {
            modal.style.display = 'none'
            overlay.classList.remove('overlay-show')
        })


        for (let i = 0; i < modalInput.length && modalLabel.length; i++) {
            modalInput[i].addEventListener('input', e => {
                modalLabel[i].classList.toggle('modal__label-focus')

            }, {
                once: true
            })
        }



        modalBtnSave.addEventListener('click', e => {
            let error = document.querySelector('.error')

            if (modalLastName.value.trim() === '' || modalName.value.trim() === '' || modalSurname.value.trim() === '') {
                error.classList.add('error-active')
                modal.style.display = 'flex';
            } else {
                error.classList.remove('error-active')
            }

        })




    }
    modalWindow()

    function getEmailIconHTML() {
        let emailSvg = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>' +
            '</svg>'

        return emailSvg
    }


    function getTelephoneIconHTML() {
        let telSvg = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<g opacity="0.7">' +
            '<circle cx="8" cy="8" r="8" fill="#9873FF"/>' +
            '<path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>' +
            '</g>' +
            '</svg>'

        return telSvg
    }

    function getVkIconHTML() {
        let vkSvg = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>' +
            '</svg>'

        return vkSvg
    }

    function getFacebookIconHTML() {
        let facebookSvg = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<g opacity="0.7">' +
            '<path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>' +
            '</g>' +
            '</svg>'


        return facebookSvg

    }

    function getAnotherIcon() {
        let anothersvg = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>' +
            '</svg>'

        return anothersvg
    }


    function textSpan(value, type) {

        let contactTooltip = document.createElement('a')
        contactTooltip.classList.add('contactTooltip')
        let typeSpan = document.createElement('span')
        typeSpan.textContent = type + ': '
        let valueSpan = document.createElement('span')
        valueSpan.textContent = value

        if (!(value instanceof HTMLElement)) {
            valueSpan.style.color = '#B89EFF'
        }
        contactTooltip.appendChild(typeSpan)
        contactTooltip.appendChild(valueSpan)


        if (type === 'Телефон' || type === 'Доп. телефон') {
            contactTooltip.textContent = ''
            contactTooltip.textContent = (value)
            contactTooltip.setAttribute('href', `tel:${value}`)
        }

        contactTooltip.style.color = 'red'


        if (type === 'Email') {
            contactTooltip.setAttribute('href', `malito:${value}`)
        }

        if (type === 'Vk') {
            contactTooltip.setAttribute('href', value)
        }

        if (type === 'Facebook') {
            contactTooltip.setAttribute('href', value)
        }

        return contactTooltip
    }


    function getContactIcon(contactType) {
        switch (contactType) {

            case 'Email':

                return getEmailIconHTML()

            case 'Телефон':

            case 'Доп. телефон':

                return getTelephoneIconHTML()

            case 'Vk':

                return getVkIconHTML()

            case 'Facebook':

                return getFacebookIconHTML()

            case 'Другое':

                return getAnotherIcon()



            default:

        }
    }




    let modalUpdId = document.querySelector('.modal-upd__id')

    const modalUpdWind = document.querySelector('.modal-upd__window')
    let modalUpdLastName = document.querySelector('.modal-upd__input-lastName')
    let modalUpdName = document.querySelector('.modal-upd__input-name')
    let modalUpdsurname = document.querySelector('.modal-upd__input-surname')
    let modalUpdContacts = document.querySelector('.modal-upd__dropdown')
    let modalUpdDelContact = document.querySelector('.modal-upd__btn-deleteClient')

    let sortColumnFlag = 'fio'
    sortDirFlag = true

    function createUser(oneClient) {

        const clientsTr = document.createElement('tr')
        clientsTr.classList.add('clientsTr', 'row', 'gx-sm-2', 'gx-md-3', 'gx-lg-4')
        const clientsID = document.createElement('td')
        const clientsFIO = document.createElement('td')

        const datediv = document.createElement('div')
        const clientsDate = document.createElement('td')
        const clientsDateTime = document.createElement('p')

        const updateDiv = document.createElement('div')
        const clientsUpdates = document.createElement('td')
        const clientsUpdateTime = document.createElement('p')
        clientsDateTime.classList.add('clients-time')
        clientsUpdateTime.classList.add('clients-time')
        const UpdDelFolder = document.createElement('div')
        const updateBtn = document.createElement('button')
        const deleteBtn = document.createElement('button')


        datediv.classList.add('col', 'flex', 'datediv')
        datediv.style.alignItems = 'baseline'
        datediv.append(clientsDate, clientsDateTime)

        updateDiv.classList.add('col', 'flex', 'updatediv')
        updateDiv.style.alignItems = 'baseline'
        updateDiv.append(clientsUpdates, clientsUpdateTime)


        const clientsContacts = document.createElement('div')

        clientsID.classList.add('clientsID')
        clientsFIO.classList.add('col-lg-3', 'clientsFIO')
        clientsDate.classList.add('col', 'clientsDate')
        clientsUpdates.classList.add('col', 'clientsUpdates')

        UpdDelFolder.classList.add('UpdDelFolder', 'flex')
        deleteBtn.classList.add('col', 'deleteBtn')
        updateBtn.classList.add('col', 'updateBtn')
        updateBtn.textContent = 'Изменить'
        UpdDelFolder.append(updateBtn, deleteBtn)

        clientsContacts.classList.add('clientsContacts', 'col')


        clientsFIO.textContent = oneClient.fio

        oneClient.contacts.forEach(contact => {
            let span = document.createElement('span');
            span.classList.add('spanContact')
            span.innerHTML = getContactIcon(contact.type)
            clientsContacts.append(span)
            span.append(textSpan(contact.value, contact.type))

            let rows = document.querySelectorAll('.clientsTr');

            rows.forEach(row => {
                let clientsContacts = row.querySelector('.clientsContacts')
                let spans = row.querySelectorAll('.spanContact')
                let count = 0;
                let showMoreBtn = document.createElement('button');
                for (let i = 0; i < spans.length; i++) {
                    if (count >= 4) {

                        spans[i].classList.add('spanHidden')

                        showMoreBtn.addEventListener('click', () => {
                            spans[i].classList.remove('spanHidden')
                            showMoreBtn.style.display = 'none'
                        })



                    } else {
                        count++; // увеличиваем счётчик
                    }
                }



                if (spans.length > 4) {
                    let existingButton = clientsContacts.querySelector('.show-more-btn');
                    if (!existingButton) {



                        let hiddenContacts = row.querySelectorAll('.spanHidden')


                        // Создаем кнопку "Показать ещё"
                        showMoreBtn.textContent = `+${hiddenContacts.length}`
                        showMoreBtn.classList.add('show-more-btn');

                        // Добавляем кнопку после последнего элемента span
                        clientsContacts.append(showMoreBtn);
                    }
                }

            })

        });

        clientsID.innerHTML = oneClient.id

        let day = ("0" + ((new Date(oneClient.createdAt)).getDate())).slice(-2)
        let month = ('0' + (1 + (new Date(oneClient.createdAt)).getMonth())).slice(-2)
        let year = new Date(oneClient.createdAt).getFullYear()
        let time = ("0" + new Date(oneClient.createdAt).getHours()).slice(-2) + ':' + ("0" + new Date(oneClient.createdAt).getMinutes()).slice(-2)

        oneClient.date = `${day+ '.' +month+ '.' + year}`

        clientsDate.innerHTML = oneClient.date
        clientsDateTime.innerHTML = time

        let dayUpd = ("0" + ((new Date(oneClient.updatedAt)).getDate())).slice(-2)
        let monthUpd = ('0' + (1 + (new Date(oneClient.updatedAt)).getMonth())).slice(-2)
        let yearUpd = new Date(oneClient.updatedAt).getFullYear()
        let timeUpd = ("0" + ((new Date(oneClient.updatedAt)).getHours())).slice(-2) + ':' + ("0" + (new Date(oneClient.updatedAt)).getMinutes()).slice(-2)



        oneClient.update = `${dayUpd + '.' + monthUpd + '.' + yearUpd}`

        clientsUpdates.innerHTML = oneClient.update
        clientsUpdateTime.innerHTML = timeUpd


        function modalDelWindow() {


            deleteBtn.textContent = 'Удалить'
            deleteBtn.addEventListener('click', function() {
                modalDel.style.display = 'flex'
                overlay.classList.toggle('overlay-show')

                modalDelbtn.addEventListener('click', async function() {
                    let clientToFind = 1
                    let user = listData.findIndex(item => item.id === oneClient.id);

                    if (user !== -1) {
                        const clientToDelete = listData[user].id

                        listData.splice(user, 1)
                        await serverDeleteClient(clientToDelete); // Ждем ответа от сервера
                    }



                    clientsTr.remove(); // Удаляем элемент из DOM только после успешного ответа
                    modalDel.style.display = 'none';
                    overlay.classList.remove('overlay-show');

                })

                modalDelCancel.addEventListener('click', function() {
                    modalDel.style.display = 'none'
                    overlay.classList.remove('overlay-show')
                })
                modalDelClose.addEventListener('click', function() {
                    modalDel.style.display = 'none'
                    overlay.classList.remove('overlay-show')
                })


            })




        }
        modalDelWindow()


        let modalUpdSave = document.querySelector('.modal-Upd__btn-saveContact')

        async function modalUpdateWindow() {

            modalUpdLastName.value = '';
            modalUpdName.value = '';
            modalUpdsurname.value = '';

            updateBtn.addEventListener('click', async function() {



                modalUpdWind.style.display = 'flex'
                overlay.classList.toggle('overlay-show')


                modalUpdId.textContent = `${oneClient.id}`
                modalUpdLastName.value = oneClient.lastName
                modalUpdName.value = oneClient.name
                modalUpdsurname.value = oneClient.surname
                modalUpdContacts = oneClient.contacts


                for (let contact of modalUpdContacts) {
                    if (contact != null) {
                        modalDropdownUpdFunc(contact.value, contact.type)
                    }
                }


                modalUpdClose.addEventListener('click', e => {
                    modalUpdWind.style.display = 'none'
                    overlay.classList.remove('overlay-show')
                })

                modalUpdDelContact.addEventListener('click', function() {
                    modalDel.style.display = 'flex'
                    modalUpdWind.style.display = 'none'

                    modalDelbtn.addEventListener('click', async function() {
                        let clientToFind = 1
                        let user = listData.findIndex(item => item.id === oneClient.id);

                        if (user !== -1) {
                            const clientToDelete = listData[user].id

                            listData.splice(user, 1)
                            await serverDeleteClient(clientToDelete);
                        }

                        clientsTr.remove()
                        modalDel.style.display = 'none'
                        overlay.classList.remove('overlay-show')
                        modalUpdWind.style.display = 'none'
                    })

                    modalDelCancel.addEventListener('click', function() {
                        modalDel.style.display = 'none'
                        overlay.style.display = 'flex'
                        modalUpdWind.style.display = 'flex'
                    })
                    modalDelClose.addEventListener('click', function() {
                        modalDel.style.display = 'none'
                        modalUpdWind.style.display = 'flex'
                    })
                })




                const formUpd = document.querySelector('.modal-upd__form');
                formUpd.addEventListener('submit', async function(event) {
                    event.preventDefault();
                    modalUpdWind.style.display = 'none';
                    overlay.classList.remove('overlay-show');

                    const contacts = [];
                    document.querySelectorAll('.dropdownUpd').forEach(dropdown => {
                        const contactTypeUpd = dropdown.querySelector('.dropdownUpd-toggle').value;
                        const contactValueUpd = dropdown.querySelector('.dropdown__inputUpd').value;
                        if (contactTypeUpd && contactValueUpd) {
                            contacts.push({
                                type: contactTypeUpd,
                                value: contactValueUpd
                            });
                        }

                    });

                    let id = oneClient.id;
                    let updatedClientObj = {
                        id: id,
                        lastName: modalUpdLastName.value.trim(),
                        name: modalUpdName.value.trim(),
                        surname: modalUpdsurname.value.trim(),
                        contacts: contacts
                    };

                    // Отправка данных на сервер и получение обновленного объекта
                    let serverUpdData = await serverUpdateClient(updatedClientObj);
                    // Отправка данных на сервер и получение актуального состояния клиента
                    let dropdownUpd = document.querySelectorAll('.dropdownUpd')
                    if (serverUpdData.id === id) {
                        const index = copyListData.findIndex(client => client.id === id);
                        if (index !== -1) {

                            copyListData[index] = serverUpdData;
                            for (let dropdown of dropdownUpd) {
                                dropdown.remove()
                            }
                        }
                    }

                    render(copyListData);
                });

            })



            modalUpdSave.addEventListener('click', e => {
                let error = document.querySelector('.errorUpd')
                if (modalUpdLastName.value.trim() === '' || modalUpdName.value.trim() === '' || modalUpdsurname.value.trim() === '') {

                    error.classList.add('error-activeUpd')
                    event.preventDefault()
                    modalUpdWind.style.display = 'flex';
                } else {
                    error.classList.remove('error-activeUpd')
                }
            })


        }
        modalUpdateWindow()



        clientsTr.append(clientsID, clientsFIO, datediv, updateDiv, clientsContacts, UpdDelFolder)

        return clientsTr

    }



    function filter(arr, prop, value) {
        if (value != "") {
            return arr.filter(el => {
                if (prop === 'fio') {
                    const fio = `${el.lastName} ${el.name} ${el.surname}`.toLowerCase();

                    return fio.includes(value.toLowerCase());
                } else {
                    return String(el[prop]).toLowerCase().includes(String(value).toLowerCase());
                }
            })
        } else {
            return arr
        }
    }



    let headerSearch = document.querySelector('.header-content__search')

    let copyListData = [...listData]
    let sortArr = [...copyListData.reverse()]


    function render(copyListData) {

        tableBody.innerHTML = ''


        if (headerSearch.value.trim() !== "") {
            copyListData = filter(copyListData, 'fio', headerSearch.value.trim())
        }

        sortArr = sortArr.sort((a, b) => {
            let sort = a[sortColumnFlag] < b[sortColumnFlag]
            if (sortDirFlag == false) sort = a[sortColumnFlag] > b[sortColumnFlag]
            return sort ? 1 : -1
        })

        copyListData.forEach(oneClient => {

            oneClient.fio = `${oneClient.lastName}
        ${oneClient.name} ${oneClient.surname}`

            oneClient.contactsHTML = oneClient.contacts.map(contact => getContactIcon(contact.type)).join(' ')

            const newTr = createUser(oneClient)

            tableBody.appendChild(newTr)

        })


    }
    render(listData.reverse())

    headerSearch.addEventListener('input', async function() {

        listData = await searchClient(copyListData)
        setTimeout(render, 300, copyListData);
    })


    tableHeadID.addEventListener('click', function() {
        tableHeadID.classList.toggle('arrowSortID')
        sortColumnFlag = 'id'
        sortDirFlag = !sortDirFlag
        render(sortArr)
    })

    tableHeadFIO.addEventListener('click', function() {
        sortColumnFlag = 'fio'
        sortDirFlag = !sortDirFlag
        tableHeadFIO.classList.toggle('arrowSortFIO')
        render(sortArr)
    })


    tableHeadDate.addEventListener('click', function() {
        sortColumnFlag = 'createdAt'
        sortDirFlag = !sortDirFlag
        render(sortArr)
        tableHeadDate.classList.toggle('arrowSortDate')
    })

    tableHeadUpdates.addEventListener('click', function() {
        sortColumnFlag = 'updatedAt'
        sortDirFlag = !sortDirFlag
        render(sortArr)
        tableHeadUpdates.classList.toggle('arrowSortDate')
    })



    let oneClient = [...copyListData]

    form.addEventListener('submit', async function(event) {
        event.preventDefault()

        const contacts = []

        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const contactType = dropdown.querySelector('.dropdown-toggle').value
            const contactValue = dropdown.querySelector('.dropdown__input').value
            if (contactType && contactValue) {
                contacts.push({
                    type: contactType,
                    value: contactValue
                })


            }
        })


        const data = {
            name: 'John Doe',
            phone: '1234567890'
        };

        localStorage.setItem('contact', JSON.stringify(data));

        // здесь берется первый элемент массива
        let clientFromArray = oneClient[0]; // здесь берется первый элемент массива
        let id = clientFromArray ? clientFromArray.id : null;


        let newClientObj = {
            id: id,
            lastName: modalLastName.value.trim(),
            name: modalName.value.trim(),
            surname: modalSurname.value.trim(),
            contacts: contacts
        }

        let serverDataObj = await serverAddClient(newClientObj)
        // Убедитесь, что код для добавления клиента в начало списка выполняется только при добавлении нового клиента, а не при обновлении
        copyListData.unshift(serverDataObj); // Это для добавления нового клиента


        render(copyListData)

        modal.style.display = 'none';
        overlay.classList.remove('overlay-show');


        const allDropdowns = document.querySelectorAll('.dropdown');

        allDropdowns.forEach(dropdown => {
            dropdown.remove();
        });


        modalLastName.value = ''
        modalName.value = ''
        modalSurname.value = ''
        form.reset() // Сбрасываем форму



    })
})