import { routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useAuth } from 'src/auth'
import Badge from 'src/components/Util/Badge/Badge'
import Button, { ButtonGroup } from 'src/components/Util/Button/Button'
import { Card, CardContent, CardHeader } from 'src/components/Util/Card/Card'
import Toast from 'src/components/Util/Toast/Toast'

import { formatNumber, timeTag } from 'src/lib/formatters'

import type {
  DeleteUserRecipeMutationVariables,
  FindUserRecipeById,
} from 'types/graphql'

const DELETE_USER_RECIPE_MUTATION = gql`
  mutation DeleteUserRecipeMutation($id: BigInt!) {
    deleteUserRecipe(id: $id) {
      id
    }
  }
`

interface Props {
  userRecipe: NonNullable<FindUserRecipeById['userRecipe']>
}

const UserRecipe = ({ userRecipe }: Props) => {
  const { currentUser } = useAuth();
  const [deleteUserRecipe] = useMutation(DELETE_USER_RECIPE_MUTATION, {
    onCompleted: () => {
      toast.success('UserRecipe deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteUserRecipeMutationVariables['id']) => {
    toast.custom((t) => (
      <Toast
        t={t}
        title={`Confirm deletion`}
        message={`Are you sure you want to delete userRecipe '${id}'?`}
        primaryAction={() => deleteUserRecipe({ variables: { id } })}
        actionType="YesNo"
      />
    ));
  }

  // TODO: Add a way to edit the recipe
  return (currentUser.role_id == 'f0c1b8e9-5f27-4430-ad8f-5349f83339c0' || (!userRecipe.public_access && userRecipe.created_by === currentUser.id)) && (
    <article>
      <div className="rw-segment">
        <Card>
          <CardHeader
            title={userRecipe.name}
            subheader={<span>Created by {userRecipe.Profile.full_name} on {timeTag(userRecipe.created_at)}</span>}
            avatar={
              <div className="h-12 w-12 rounded bg-white p-1">
                {userRecipe.name === "Cage Turret Tower" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    viewBox="0 0 320 336"
                    fill="#000000"
                  >
                    <path
                      stroke="none"
                      d="
M188.999878,270.360046
C156.356644,270.359344 124.213432,270.359039 92.070221,270.357910
C90.404778,270.357849 88.736168,270.283478 87.074516,270.361115
C83.252411,270.539673 80.179565,269.327454 80.128532,265.091278
C80.078117,260.907227 82.974106,259.560974 86.888199,259.625610
C93.714684,259.738312 100.544380,259.657623 107.372734,259.654572
C114.560135,259.651367 114.672043,259.669189 115.895233,252.666382
C119.498161,232.039490 123.009750,211.396622 126.541779,190.757385
C127.073875,187.648071 126.834709,185.693176 122.656418,185.037125
C114.558167,183.765625 110.021690,177.456726 109.837852,168.408813
C109.700020,161.625473 109.810638,154.837112 109.810638,148.705551
C108.216194,147.294952 107.234886,147.696045 106.251160,147.775787
C103.103935,148.030945 101.241623,146.370926 100.320671,143.528473
C99.333206,140.480713 101.175011,138.754974 103.511238,137.552200
C111.207970,133.589584 118.957466,129.729202 126.697113,125.850327
C136.223160,121.076149 145.817001,116.432739 155.262314,111.504318
C158.844727,109.635063 161.930649,109.519524 165.596191,111.392906
C181.898376,119.724594 198.325180,127.812103 214.683472,136.034576
C217.733505,137.567673 221.770462,138.697662 220.818329,143.299591
C219.868866,147.888596 216.150452,148.355576 211.265366,147.307983
C211.265366,153.928299 211.188065,160.010529 211.291840,166.089661
C211.364258,170.331863 210.816177,174.386215 208.702957,178.130402
C206.399734,182.211258 202.661713,184.563660 198.263916,185.068756
C194.418930,185.510345 193.952835,187.331696 194.473282,190.391495
C196.897186,204.641968 199.311478,218.894104 201.725815,233.146194
C202.946472,240.351883 204.279449,247.541473 205.326584,254.772385
C205.853577,258.411469 207.439972,259.860504 211.235397,259.732361
C218.721298,259.479614 226.222717,259.729004 233.716095,259.638000
C237.658203,259.590149 241.070007,260.475647 240.954132,265.102783
C240.839630,269.675873 237.364456,270.391205 233.467331,270.371368
C218.811874,270.296844 204.155746,270.353027 188.999878,270.360046
M129.353729,136.889236
C127.716599,137.706543 126.125862,138.639603 124.433067,139.318008
C120.428917,140.922729 121.046173,144.303665 121.445503,147.371964
C121.866478,150.606583 124.701920,149.615662 126.659607,149.620972
C149.125198,149.682022 171.591019,149.669922 194.056763,149.649521
C199.317719,149.644745 200.833740,147.585602 199.652634,142.552246
C199.145111,140.389404 197.419189,139.787491 195.822433,138.984131
C185.124146,133.601547 174.369125,128.329681 163.729202,122.834686
C161.357285,121.609711 159.510208,121.747528 157.232788,122.914543
C148.203705,127.541260 139.091812,132.006348 129.353729,136.889236
M166.499878,174.656662
C174.317612,174.655945 182.135361,174.662003 189.953079,174.652756
C199.060333,174.641983 200.323669,173.185272 199.795959,164.159531
C199.634750,161.402451 198.626572,160.325455 195.886154,160.330826
C172.266769,160.377045 148.647247,160.351013 125.027779,160.367844
C123.719139,160.368774 122.386421,160.352432 121.581795,161.810730
C118.318031,167.726028 122.285934,174.619019 129.072601,174.643372
C141.214890,174.686951 153.357422,174.656021 166.499878,174.656662
M182.779404,199.407684
C185.530807,196.756439 183.368820,193.760620 183.318237,190.935318
C183.241302,186.637390 181.094452,185.112457 176.646057,185.245911
C165.858978,185.569534 155.055054,185.295731 144.258926,185.385605
C142.130539,185.403320 138.842438,184.354736 138.563400,187.671738
C138.218506,191.771744 134.383362,196.170761 139.084503,200.113052
C145.065811,205.128830 151.113251,210.074463 156.913925,215.292938
C159.523010,217.640121 161.368790,217.806900 164.060028,215.371368
C169.967606,210.025085 176.165878,204.999985 182.779404,199.407684
M133.794052,256.121124
C132.967773,257.060791 131.544113,257.571472 131.559494,259.259705
C150.934158,259.259705 170.250854,259.259705 190.817352,259.259705
C180.758026,250.525253 171.624451,242.562271 162.448105,234.648880
C160.065918,232.594604 158.499420,234.640244 156.905518,236.019760
C149.354965,242.554642 141.826721,249.115311 133.794052,256.121124
M187.967896,219.418839
C187.462906,217.034546 187.755692,214.440140 185.777832,211.760208
C180.323074,216.330338 174.970642,220.814728 169.216125,225.636017
C176.868027,232.157150 183.838898,238.097916 190.809769,244.038681
C191.195953,243.778412 191.582123,243.518158 191.968307,243.257904
C190.692993,235.584946 189.417694,227.911987 187.967896,219.418839
M141.028931,216.489685
C138.982040,215.001389 137.452469,212.707687 134.480194,211.983719
C132.404663,222.679123 130.449005,233.009415 129.097260,245.071671
C137.292328,238.060074 144.285828,232.076553 151.725922,225.710907
C148.040894,222.535919 144.803497,219.746597 141.028931,216.489685
z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="pointer-events-none w-full p-2"
                    fill="#000000"
                    viewBox="0 0 512 512"
                  >
                    <path d="M207.1 64C207.1 99.35 179.3 128 143.1 128C108.7 128 79.1 99.35 79.1 64C79.1 28.65 108.7 0 143.1 0C179.3 0 207.1 28.65 207.1 64zM143.1 16C117.5 16 95.1 37.49 95.1 64C95.1 90.51 117.5 112 143.1 112C170.5 112 191.1 90.51 191.1 64C191.1 37.49 170.5 16 143.1 16zM15.06 315.8C12.98 319.7 8.129 321.1 4.232 319.1C.3354 316.1-1.136 312.1 .9453 308.2L50.75 214.1C68.83 181.1 104.1 160 142.5 160H145.5C183.9 160 219.2 181.1 237.3 214.1L287.1 308.2C289.1 312.1 287.7 316.1 283.8 319.1C279.9 321.1 275 319.7 272.9 315.8L223.1 222.5C207.8 193.9 178 175.1 145.5 175.1H142.5C110 175.1 80.16 193.9 64.86 222.5L15.06 315.8zM72 280C76.42 280 80 283.6 80 288V476C80 487 88.95 496 99.1 496C111 496 119.1 487 119.1 476V392C119.1 378.7 130.7 368 143.1 368C157.3 368 168 378.7 168 392V476C168 487 176.1 496 187.1 496C199 496 207.1 487 207.1 476V288C207.1 283.6 211.6 280 215.1 280C220.4 280 223.1 283.6 223.1 288V476C223.1 495.9 207.9 512 187.1 512C168.1 512 152 495.9 152 476V392C152 387.6 148.4 384 143.1 384C139.6 384 135.1 387.6 135.1 392V476C135.1 495.9 119.9 512 99.1 512C80.12 512 64 495.9 64 476V288C64 283.6 67.58 280 72 280V280zM438 400L471.9 490.4C475.8 500.8 468.1 512 456.9 512H384C375.2 512 368 504.8 368 496V400H352C334.3 400 320 385.7 320 368V224C320 206.3 334.3 192 352 192H368V160C368 148.2 374.4 137.8 384 132.3V16H376C371.6 16 368 12.42 368 8C368 3.582 371.6 0 376 0H416C424.8 0 432 7.164 432 16V132.3C441.6 137.8 448 148.2 448 160V269.3L464 264V208C464 199.2 471.2 192 480 192H496C504.8 192 512 199.2 512 208V292.5C512 299.4 507.6 305.5 501.1 307.6L448 325.3V352H496C504.8 352 512 359.2 512 368V384C512 392.8 504.8 400 496 400L438 400zM416 141.5V16H400V141.5L392 146.1C387.2 148.9 384 154.1 384 160V384H496V368H432V160C432 154.1 428.8 148.9 423.1 146.1L416 141.5zM456.9 496L420.9 400H384V496H456.9zM448 308.5L496 292.5V208H480V275.5L448 286.2V308.5zM336 224V368C336 376.8 343.2 384 352 384H368V208H352C343.2 208 336 215.2 336 224z" />
                  </svg>
                )}
              </div>
            }
          />
          <CardContent>
            <div className='flex flex-row flex-wrap gap-3 my-3'>
              {userRecipe?.UserRecipeItemRecipe.map(({ id, amount, ItemRecipe }) => {
                console.log(ItemRecipe)
                return (
                  <Button
                    className="aspect-square"
                    variant="outlined"
                    color="DEFAULT"
                    title={`${ItemRecipe.Item_ItemRecipe_crafted_item_idToItem.name} - ${amount}`}
                  >
                    <div className="flex flex-col items-center justify-center w-16 p-1">
                      <img
                        className="h-10 w-10"
                        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${ItemRecipe.Item_ItemRecipe_crafted_item_idToItem.image}`}
                      />
                      <span className="text-xs">{ItemRecipe.Item_ItemRecipe_crafted_item_idToItem.name}</span>
                    </div>
                    <Badge color="DEFAULT" variant="standard" size="small" className="absolute top-0 right-2.5" max={1000000} content={formatNumber(amount, { notation: "compact" })} />
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <ButtonGroup className='my-3'>
        <Button
          permission="gamedata_create"
          color="primary"
          variant="outlined"
          to={routes.editUserRecipe({ id: userRecipe.id })}
          startIcon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L45.11 338.9c-8.568 8.566-14.53 19.39-17.18 31.21l-27.61 122.8C-1.7 502.1 6.158 512 15.95 512c1.047 0 2.116-.1034 3.198-.3202c0 0 84.61-17.95 122.8-26.93c11.54-2.717 21.87-8.523 30.25-16.9l321.2-321.2C518.3 121.7 518.2 81.26 493.2 56.26zM149.5 445.2c-4.219 4.219-9.252 7.039-14.96 8.383c-24.68 5.811-69.64 15.55-97.46 21.52l22.04-98.01c1.332-5.918 4.303-11.31 8.594-15.6l247.6-247.6l82.76 82.76L149.5 445.2zM470.7 124l-50.03 50.02l-82.76-82.76l49.93-49.93C393.9 35.33 401.9 32 410.5 32s16.58 3.33 22.63 9.375l37.51 37.51C483.1 91.37 483.1 111.6 470.7 124z" />
            </svg>
          }
        >
          Edit
        </Button>
        <Button
          permission="gamedata_delete"
          color="error"
          variant="outlined"
          onClick={() => onDeleteClick(userRecipe.id)}
          startIcon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
            </svg>
          }
        >
          Delete
        </Button>
      </ButtonGroup>
    </article>
  )
}

export default UserRecipe
