export function getDataSource(){

  return new Promise((r)=>{
    setTimeout(()=>{
      r(new Array(20).fill(null).map((_,index)=>(
        {
          title:"see you next time " + index,
          index,
          children: new Array(Math.ceil(Math.random()*10+3)).fill(null).map((_,index)=>`I am see you next item ${index}`)
        }
      )))
    },1000)
  })

}