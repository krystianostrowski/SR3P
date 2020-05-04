const switchesPatent = document.querySelector('#switches__container');
const overlays = document.querySelectorAll('.overlay--hidden');
const overlaysObj = [];

const PerformOverlaysObj = () => {
    for(overlay of overlays)
    {
        overlaysObj.push({id: overlay.id, node: overlay});
    }
};

if(switchesPatent != null)
{
    switchesPatent.addEventListener('click', e => {
        if(e.target.classList.contains('switches__checkbox'))
        {
            const checkbox = e.target;

            for(ov of overlaysObj)
            {
                if(ov.id === checkbox.getAttribute('aria-controls'))
                {
                    ov.node.classList.toggle('overlay--hidden');
                }
            }
        }
    });
}