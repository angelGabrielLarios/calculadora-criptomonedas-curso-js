(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const monedaSelect = document.getElementById(`moneda`)
        const criptomonedaSelect = document.getElementById('criptomoneda')
        const formulario = document.getElementById('formulario')
        const resultado = document.getElementById('resultado')
        console.log(resultado);

        const objBusqueda = {
            moneda: '',
            criptomoneda: ''
        }

        

        const limpiarHTML = elementhtml => {
            [...elementhtml.children].forEach(item => item.remove())
        }

        const mostrarLoader = () => {
            limpiarHTML(resultado)
            const loaderTemplate = 
            `
            <div aria-label="Orange and tan hamster running in a metal wheel" role="img"
            class="wheel-and-hamster">
                <div class="wheel"></div>
                <div class="hamster">
                    <div class="hamster__body">
                        <div class="hamster__head">
                            <div class="hamster__ear"></div>
                            <div class="hamster__eye"></div>
                            <div class="hamster__nose"></div>
                        </div>
                        <div class="hamster__limb hamster__limb--fr"></div>
                        <div class="hamster__limb hamster__limb--fl"></div>
                        <div class="hamster__limb hamster__limb--br"></div>
                        <div class="hamster__limb hamster__limb--bl"></div>
                        <div class="hamster__tail"></div>
                    </div>
                </div>
                <div class="spoke"></div>
            </div>
            `
            resultado.innerHTML = loaderTemplate
        }

        const mostrarInfoCriptoHTML = objCriptInfo => {

            const  { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = objCriptInfo

            const infoTemplate = 
            `
            <h4 class="">
                El precio es <b>${PRICE}</b>
            </h4>

            <p>El precio más alto del dia: <b>${HIGHDAY}</b></p>

            <p>El precio más alto del dia: <b>${LOWDAY}</b></p>

            <p>Variación en las últimas horas: <b>${CHANGEPCT24HOUR}</b></p>

            <p>Última actualización: <b>${LASTUPDATE}</b></p>
            `

            limpiarHTML(resultado)

            resultado.innerHTML = infoTemplate
        }
        const relizarPeticionAPI = () => {
            const {moneda, criptomoneda} = objBusqueda

            const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
            mostrarLoader()
            fetch(url)
                .then(respuesta => respuesta.json())
                .then(resultado => {
                    const objCriptInfo = resultado.DISPLAY[criptomoneda][moneda]
                    console.log(resultado);
                    mostrarInfoCriptoHTML(objCriptInfo);
                })
        }

        const sincronizarObjBusqueda = event => {
            const select = event.target
            if(select.tagName === 'SELECT') {
                objBusqueda[select.id] = select.value
            }
        }

        const mostrarAlertaError = mensaje => {
            const existeAlerta = document.querySelector('.alert-danger')
            if(existeAlerta) return

            const alertaTemplate = 
            `
            <div class="alert alert-danger text-center fw-bold text-uppercase mt-4">
                ${mensaje}
            </div>
            `

            formulario.insertAdjacentHTML('beforeend', alertaTemplate)

            setTimeout(() => {
                const alerta = document.querySelector('.alert-danger')
                alerta.remove()
            }, 4000);
        }

        const llenarSelectCriptos = arrCriptomonedas => {
            console.log(arrCriptomonedas)

            const fragment = document.createDocumentFragment()
            arrCriptomonedas.forEach(objCripto => {
                const {Name, FullName} = objCripto
                const optionCripto = document.createElement('option')

                optionCripto.value = Name
                optionCripto.textContent = FullName

                fragment.append(optionCripto)

            })

            /* insertar en el html */
            criptomonedaSelect.append(fragment)
        }

        const consultarCriptos = () => {
            const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`

            fetch(url)
                .then(respuesta => respuesta.json())
                .then(resultado => {
                    const arrCriptomonedas = resultado.Data.map(item => item.CoinInfo)
                    llenarSelectCriptos(arrCriptomonedas)
                })
        }

        consultarCriptos()

        const validarFormulario = event => {

            event.preventDefault()

            const moneda = monedaSelect.value
            const criptomoneda = criptomonedaSelect.value

            const estaVacio = [moneda, criptomoneda].includes('')
            if(estaVacio) {
                mostrarAlertaError('ambos campos son obligatorios')
                return
            }

            relizarPeticionAPI()
        }

        formulario.addEventListener('change', sincronizarObjBusqueda)
        formulario.addEventListener('submit', validarFormulario)
    })


})();