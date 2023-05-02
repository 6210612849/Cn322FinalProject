const dataList = document.getElementById('dataList');
console.log(
    "work")
fetch('http://localhost:800/api/v1/chat/getalluser')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerText = item.name;
            dataList.appendChild(listItem);
        });
    });